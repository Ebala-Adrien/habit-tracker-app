import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import GoogleIcon from "./components/icons/GoogleIcon";
import constants from "./constants";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import LoadingComponent from "./components/utility/Loading";
import { useAuthContext } from "./contexts/AuthContext";
import { useEffect, useState } from "react";

const schema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string()
    .required()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot be more than 8 characters")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(/[a-z]/, "Password must include at least one lowercase letter")
    .matches(/[0-9]/, "Password must include at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must include at least one special character (@, $, !, %, *, ?, &)"
    ),
});

export default function LoginPage() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { authCtxIsLoading, setAuthCtxIsLoading } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const onSubmit: SubmitHandler<any> = async (data) => {
    setAuthCtxIsLoading(true);
    const { email, password } = data;

    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {})
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          setErrorMessage("Either the email address or password is not valid.");
        } else {
          setErrorMessage(
            "An error occurred while trying to login. Please try again."
          );
        }
      })
      .finally(() => setAuthCtxIsLoading(false));
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.page_contentContainerStyle}
    >
      <View style={[styles.content_container]}>
        <Text style={styles.title}>Log into your account</Text>
        <View style={styles.subtitle_container}>
          <Text>Do you not have an account yet? </Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.subtitle_part_two}>Register</Text>
          </Pressable>
        </View>

        <View style={styles.input_container}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  placeholder="Email address"
                />
                {errors["email"] ? (
                  <Text style={styles.input_error}>
                    {errors["email"].message}
                  </Text>
                ) : null}
              </>
            )}
          />
          <View>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={[styles.input]}
                    secureTextEntry={true}
                    placeholder="Password"
                  />
                  {errors["password"] ? (
                    <Text style={styles.input_error}>
                      {errors["password"].message}
                    </Text>
                  ) : null}
                </>
              )}
            />
          </View>
        </View>

        {errorMessage && (
          <View>
            <Text style={styles.input_error}>{errorMessage}</Text>
          </View>
        )}

        <Pressable style={styles.login_button} onPress={handleSubmit(onSubmit)}>
          {authCtxIsLoading ? (
            <LoadingComponent size={30} color={constants.colorSecondary} />
          ) : (
            <Text style={styles.login_button_text}>Login</Text>
          )}
        </Pressable>

        {/* <View style={styles.or_content_container}>
          <View style={styles.line}></View>
          <Text style={styles.or_text}>or log in with</Text>
          <View style={styles.line}></View>
        </View>

        <View style={[styles.container_logo_container]}>
          <Pressable style={[styles.logo_container]}>
            <GoogleIcon />
          </Pressable>
        </View> */}
      </View>
    </ScrollView>
  );
}

// Template: https://dribbble.com/shots/24364001-Recognotes-Mobile-App-Design

// Icon from: https://icons8.com/icons/set/google

const styles = StyleSheet.create({
  page: {
    flex: 1,
    display: "flex",
  },
  page_contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: constants.padding * 2,
  },
  content_container: {
    flex: 1,
    margin: constants.padding * 2,
    justifyContent: "center",
    alignItems: "center",
    gap: constants.padding * 3,
    width: "100%",
  },
  title: {
    fontWeight: constants.fontWeight,
    fontSize: constants.mediumFontSize,
  },
  subtitle_container: {
    fontWeight: constants.fontWeight,
    display: "flex",
    flexDirection: "row",
  },
  subtitle_part_two: {
    color: constants.colorQuarternary,
  },
  input_container: {
    gap: constants.padding,
    width: "100%",
  },
  input: {
    backgroundColor: constants.colorPrimary,
    height: constants.padding * 5,
    padding: constants.padding,
    borderRadius: 5,
  },
  input_error: {
    color: constants.colorError,
  },
  login_button: {
    borderRadius: 5,
    backgroundColor: constants.colorQuarternary,
    borderWidth: constants.borderWidth,
    borderColor: constants.colorQuarternary,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: constants.padding,
  },
  login_button_text: {
    width: "100%",
    textAlign: "center",
    color: constants.colorSecondary,
    fontWeight: constants.fontWeight,
    fontSize: constants.mediumFontSize,
  },
  or_content_container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  line: {
    flex: 1,
    height: constants.borderWidth,
    backgroundColor: constants.colorPrimary,
  },
  or_text: {
    marginHorizontal: constants.padding,
    fontWeight: constants.fontWeight,
  },
  container_logo_container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: constants.padding,
  },
  logo_container: {
    flex: 1,
    borderRadius: 5,
    borderColor: constants.colorPrimary,
    borderWidth: constants.borderWidth,
    padding: constants.margin,
    justifyContent: "center",
    alignItems: "center",
  },
});
