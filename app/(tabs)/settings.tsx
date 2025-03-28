import { Pressable, View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuthContext } from "@/contexts/AuthContext";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import Header from "@/components/utility/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";
import constants from "@/constants";
import { useRouter } from "expo-router";

type IconiconsNames = React.ComponentProps<typeof Ionicons>["name"];
type MaterialIconNames = React.ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

interface SettingItem {
  icon: MaterialIconNames | IconiconsNames;
  label: string;
  value?: string;
  type: "material" | "ionicons";
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function SettingsPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  const settingsSections: SettingSection[] = [
    {
      title: "Account",
      items: [
        {
          icon: "mail-outline",
          label: "Email",
          value: user?.email || "Not signed in",
          type: "ionicons",
        },
      ],
    },

    // I can add more sections such as notifications, privacy, etc.
  ];

  const SettingItem = ({ item }: { item: SettingItem }) => {
    if (item.type === "material") {
      return (
        <Pressable style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={item.icon as MaterialIconNames}
                size={22}
                color={constants.colorPrimary}
              />
            </View>
            <Text style={styles.settingLabel}>{item.label}</Text>
          </View>
          <View style={styles.settingItemRight}>
            {item.value && (
              <Text style={styles.settingValue}>{item.value}</Text>
            )}
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable style={styles.settingItem}>
        <View style={styles.settingItemLeft}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={item.icon as IconiconsNames}
              size={22}
              color={constants.colorPrimary}
            />
          </View>
          <Text style={styles.settingLabel}>{item.label}</Text>
        </View>
        <View style={styles.settingItemRight}>
          {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
        </View>
      </Pressable>
    );
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Clear navigation history and redirect to login
        router.replace("/login");
      })
      .catch((_) => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header simple />

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </View>

        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <SettingItem key={itemIndex} item={item} />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.signOutButtonPressed,
            ]}
            onPress={handleSignOut}
          >
            <Feather name="log-out" size={20} color="#FFF" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.colorBackground,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: constants.padding * 2,
  },
  headerTitle: {
    fontSize: constants.largeFontSize,
    fontWeight: "700",
    color: constants.colorTertiary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: constants.smallFontSize,
    color: constants.colorQuinary,
  },
  section: {
    marginBottom: constants.padding * 2,
  },
  sectionTitle: {
    fontSize: constants.smallFontSize,
    fontWeight: "600",
    color: constants.colorPrimary,
    marginLeft: constants.padding * 2,
    marginBottom: constants.padding,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: constants.colorSecondary,
    borderRadius: 16,
    marginHorizontal: constants.padding,
    shadowColor: constants.colorTertiary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: constants.padding * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: constants.colorBorder,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: `${constants.colorPrimary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: constants.padding,
  },
  settingLabel: {
    fontSize: constants.mediumFontSize,
    color: constants.colorTertiary,
    fontWeight: constants.fontWeight,
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: constants.smallFontSize,
    color: constants.colorQuinary,
  },
  footer: {
    padding: constants.padding * 2,
    alignItems: "center",
  },
  signOutButton: {
    backgroundColor: constants.colorError,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: constants.padding * 1.5,
    borderRadius: 12,
    width: "100%",
    gap: 8,
  },
  signOutButtonPressed: {
    opacity: 0.9,
  },
  signOutButtonText: {
    color: constants.colorSecondary,
    fontSize: constants.mediumFontSize,
    fontWeight: "600",
  },
});
