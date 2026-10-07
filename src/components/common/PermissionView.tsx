import React from 'react';
import {Button} from './Button';
import {StateView} from './StateView';
export function PermissionView({status, onRequest, onDefault, onSettings}: {status: 'denied' | 'blocked' | 'error'; onRequest: () => void; onDefault: () => void; onSettings: () => void}) {
  const blocked = status === 'blocked';
  const error = status === 'error';
  return <StateView title={error ? 'Không lấy được vị trí' : 'Cần quyền vị trí'} message={error ? 'Hãy bật dịch vụ vị trí và thử lại, hoặc dùng dự báo cho Hà Nội.' : `Ứng dụng dùng vị trí để hiện thời tiết nơi bạn đang ở.${blocked ? ' Quyền đang bị tắt trong Cài đặt.' : ''}`} icon="location-off">
    <Button title={blocked ? 'Mở Cài đặt' : error ? 'Thử lại' : 'Cho phép'} onPress={blocked ? onSettings : onRequest} />
    <Button title="Dùng Hà Nội" variant="secondary" onPress={onDefault} />
  </StateView>;
}
