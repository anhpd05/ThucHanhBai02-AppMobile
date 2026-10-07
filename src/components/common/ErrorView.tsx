import React from 'react';
import {Button} from './Button';
import {StateView} from './StateView';
export function ErrorView({message, onRetry}: {message: string; onRetry: () => void}) {
  return <StateView title="Không tải được dữ liệu" message={message} icon="alert" danger><Button title="Thử lại" onPress={onRetry} /></StateView>;
}
