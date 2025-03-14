import { Pressable, View, Text } from "react-native";
import constants from "../constants";
import { useAuthContext } from "../contexts/AuthContext";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";

export default function SettingsPage() {
  const { user } = useAuthContext();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((_) => {});
  };

  return (
    <View
      style={{
        flex: 1,
        padding: constants.padding,
        gap: constants.padding * 2,
      }}
    >
      <Pressable
        style={{
          backgroundColor: constants.colorError,
          padding: constants.padding,
          borderRadius: 5,
        }}
        onPress={handleSignOut}
      >
        <Text
          style={{
            color: constants.colorSecondary,
            textAlign: "center",
            fontSize: constants.mediumFontSize,
            fontWeight: constants.fontWeight,
          }}
        >
          Log out
        </Text>
      </Pressable>

      {user ? <Text style={{ textAlign: "center" }}>{user.email}</Text> : null}
    </View>
  );
}
