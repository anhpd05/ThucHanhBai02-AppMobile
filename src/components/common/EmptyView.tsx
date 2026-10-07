import React from 'react';
import {Button} from './Button';
import {StateView} from './StateView';
export function EmptyView({onRetry}: {onRetry: () => void}) {
  return <StateView title="Chưa có dữ liệu dự báo" message="Nguồn dữ liệu chưa trả về dự báo cho vị trí này." icon="refresh"><Button title="Tải lại" onPress={onRetry} /></StateView>;
}
