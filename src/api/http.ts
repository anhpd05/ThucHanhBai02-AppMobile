import { REQUEST_TIMEOUT_MS } from '../constants';

export type AppErrorKind = 'network' | 'http' | 'timeout' | 'aborted';

export class AppError extends Error {
  readonly kind: AppErrorKind;

  constructor(kind: AppErrorKind, message: string) {
    super(message);
    this.name = 'AppError';
    this.kind = kind;
  }
}

export async function getJson(
  url: string,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
  signal?: AbortSignal,
): Promise<unknown> {
  if (signal?.aborted) {
    throw new AppError('aborted', 'Yêu cầu đã được huỷ.');
  }

  const controller = new AbortController();
  let timeout: number | undefined;
  let cancel: (() => void) | undefined;
  let interruption: AppError | null = null;

  const interrupted = new Promise<never>((_resolve, reject) => {
    const interrupt = (error: AppError) => {
      if (interruption) {
        return;
      }
      interruption = error;
      reject(error);
      controller.abort();
    };
    cancel = () => interrupt(new AppError('aborted', 'Yêu cầu đã được huỷ.'));
    signal?.addEventListener('abort', cancel);
    timeout = setTimeout(() => {
      interrupt(
        new AppError('timeout', 'Kết nối quá thời gian chờ. Vui lòng thử lại.'),
      );
    }, timeoutMs);
  });

  const fetchJson = async (): Promise<unknown> => {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new AppError(
        'http',
        `Máy chủ trả về lỗi HTTP ${response.status}. Vui lòng thử lại.`,
      );
    }
    try {
      const payload: unknown = await response.json();
      return payload;
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        throw new AppError('http', 'Máy chủ trả về dữ liệu không hợp lệ.');
      }
      throw error;
    }
  };

  try {
    // Dùng race để huỷ request vẫn dứt điểm kể cả khi fetch bỏ qua tín hiệu abort.
    const payload = await Promise.race([fetchJson(), interrupted]);
    if (interruption) {
      throw interruption;
    }
    return payload;
  } catch (error: unknown) {
    if (interruption) {
      throw interruption;
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'network',
      'Không thể kết nối máy chủ. Kiểm tra kết nối mạng rồi thử lại.',
    );
  } finally {
    clearTimeout(timeout);
    if (cancel) {
      signal?.removeEventListener('abort', cancel);
    }
  }
}
