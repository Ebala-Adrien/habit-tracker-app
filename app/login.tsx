import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
// import GoogleIcon from "./components/icons/GoogleIcon";
import constants from "../constants";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { Link, useRouter } from "expo-router";
import LoadingComponent from "../components/utility/Loading";
import { useAuthContext } from "../contexts/AuthContext";
import { useState } from "react";
import styles from "../styles/login_and_register_style";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";

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
      /[@$!%*?&;]/,
      "Password must include at least one special character (@, $, !, %, *, ?, &, ;)"
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

  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const onSubmit: SubmitHandler<any> = async (data) => {
    setAuthCtxIsLoading(true);
    const { email, password } = data;

    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        router.push("/(tabs)");
      })
      .catch((error) => {
        console.log(error.message);
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

        <View style={styles.inputs_container}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={(e) => {
                    setErrorMessage(null);
                    onChange(e);
                  }}
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
          <View style={styles.input_container}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.input_container}>
                  <Pressable
                    onPress={() => setHidePassword(!hidePassword)}
                    style={styles.hide_password_container}
                  >
                    {hidePassword ? (
                      <AntDesign name="eye" size={30} color="black" />
                    ) : (
                      <AntDesign name="eyeo" size={30} color="black" />
                    )}
                  </Pressable>
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={(e) => {
                      setErrorMessage(null);
                      onChange(e);
                    }}
                    value={value}
                    style={[styles.input]}
                    secureTextEntry={hidePassword}
                    placeholder="Password"
                  />
                  {errors["password"] ? (
                    <Text style={styles.input_error}>
                      {errors["password"].message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          </View>
          <View style={styles.forgot_password_container}>
            <Link style={styles.forgot_password_link} href="/ForgotPassword">
              Forgot password?
            </Link>
          </View>
        </View>

        {errorMessage && (
          <View>
            <Text style={styles.input_error}>{errorMessage}</Text>
          </View>
        )}

        <Pressable style={styles.login_button} onPress={handleSubmit(onSubmit)}>
          {authCtxIsLoading ? (
            <LoadingComponent size={30} color={constants.colorPrimary} />
          ) : (
            <Text style={styles.login_button_text}>Login</Text>
          )}
        </Pressable>
        {/* 
        <View style={styles.or_content_container}>
          <View style={styles.line}></View>
          <Text style={styles.or_text}>or log in with</Text>
          <View style={styles.line}></View>
        </View>

        <View style={[styles.container_logo_container]}>
          <Pressable
            style={[styles.logo_container]}
          >
            <GoogleIcon />
          </Pressable>
        </View> */}
      </View>
    </ScrollView>
  );
}

// Icon from: https://icons8.com/icons/set/google
