const net = require('net');
const { spawn, execFile } = require('child_process');

const cliPath = require.resolve('@react-native-community/cli/build/bin.js');

const DEFAULT_PORT = 8081;
const MAX_ATTEMPTS = 20;
const ADB_REVERSE_INTERVAL_MS = 2000;

function isPortFree(port) {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    // Không truyền host để bind dual-stack (::), giống cách Metro tự bind,
    // tránh bỏ sót tiến trình cũ đang giữ cổng trên IPv6.
    server.listen(port);
  });
}

async function findFreePort(startPort) {
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const port = startPort + i;
    if (await isPortFree(port)) {
      return port;
    }
  }
  throw new Error(
    `Không tìm được cổng trống sau ${MAX_ATTEMPTS} lần thử từ ${startPort}.`,
  );
}

function run(command, args) {
  return new Promise(resolve => {
    execFile(command, args, (error, stdout) =>
      resolve({ error, stdout: stdout || '' }),
    );
  });
}

async function getConnectedDeviceIds() {
  const { error, stdout } = await run('adb', ['devices']);
  if (error) {
    return null; // adb không có sẵn hoặc lỗi khác — bỏ qua reverse
  }
  return stdout
    .split('\n')
    .slice(1)
    .map(line => line.trim())
    .filter(line => line.endsWith('\tdevice'))
    .map(line => line.split('\t')[0]);
}

// Tự "adb reverse" cho các thiết bị/emulator đang kết nối (và những cái vừa
// kết nối sau khi Metro đã chạy), để app trên máy thật cũng tới được Metro
// khi cổng không phải 8081 mặc định.
function startAdbReverseWatcher(port) {
  const reversedDevices = new Set();
  let stopped = false;

  const tick = async () => {
    if (stopped) return;
    const deviceIds = await getConnectedDeviceIds();
    if (deviceIds === null) {
      stopped = true; // adb không dùng được, không cần thử lại
      return;
    }
    for (const id of deviceIds) {
      if (reversedDevices.has(id)) continue;
      const { error } = await run('adb', [
        '-s',
        id,
        'reverse',
        `tcp:${port}`,
        `tcp:${port}`,
      ]);
      if (!error) {
        reversedDevices.add(id);
        console.log(`Đã "adb reverse tcp:${port}" cho thiết bị ${id}.`);
      }
    }
  };

  const interval = setInterval(tick, ADB_REVERSE_INTERVAL_MS);
  tick();

  return () => {
    stopped = true;
    clearInterval(interval);
  };
}

(async () => {
  const requestedPort = Number(process.env.RCT_METRO_PORT) || DEFAULT_PORT;
  const port = await findFreePort(requestedPort);

  if (port !== requestedPort) {
    console.log(
      `Cổng ${requestedPort} đang được sử dụng, chuyển sang cổng ${port}.`,
    );
  }

  const stopAdbReverseWatcher = startAdbReverseWatcher(port);

  const extraArgs = process.argv.slice(2);
  const child = spawn(
    process.execPath,
    [cliPath, 'start', '--port', String(port), ...extraArgs],
    { stdio: 'inherit' },
  );

  child.on('exit', code => {
    stopAdbReverseWatcher();
    process.exit(code ?? 0);
  });
})();
