import { Stack } from "expo-router";
import { SessionProvider, useSession } from "inflow/ctx";

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <>
      <RootNavigator />
    </>
  );
}

function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack>
      <Stack.Protected guard={session!=null}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}
