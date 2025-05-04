import { Button } from 'react-native';
import { useSessionStore } from '~/store/sessionStore';

export function FinishButton() {
  const endSession = useSessionStore(s => s.endSession);

  return (
    <Button
      title="Finish Session"
      onPress={async () => {
        await endSession();
        // optional: navigate home, show toast, etc.
      }}
    />
  );
}
