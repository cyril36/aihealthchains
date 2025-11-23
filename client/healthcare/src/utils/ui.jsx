import { Loader, Message } from "rsuite";

export function LoadingState({ message }) {
  return <div style={{ textAlign: 'center', padding: '40px' }}><Loader size="md" content={message} /></div>;
}
export function ErrorState({ message }) {
  return <Message type="error" showIcon style={{ margin: '20px' }}>{message}</Message>;
}
export function EmptyState({ message }) {
  return <div style={{ textAlign: 'center', padding: '30px', color: 'hsl(210, 8%, 45%)' }}>{message}</div>;
}
