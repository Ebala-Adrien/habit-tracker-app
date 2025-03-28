import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
// import GoogleIcon from "./components/icons/GoogleIcon";
import constants from "@/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import LoadingComponent from "@/components/utility/Loading";
import { useAuthContext } from "@/contexts/AuthContext";
import React, { useState } from "react";
import styles from "@/styles/login_and_register_style";
import AntDesign from "@expo/vector-icons/AntDesign";

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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function RegisterPage() {
  const router = useRouter();
  const { authCtxIsLoading, setAuthCtxIsLoading } = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);

  const onSubmit: SubmitHandler<any> = async (data) => {
    setAuthCtxIsLoading(true);
    const { email, password } = data;

    createUserWithEmailAndPassword(auth, email, password)
      .then((_) => {
        setAuthCtxIsLoading(false);
        router.push("/login");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage(
            "There is already an account registered with this email address."
          );
        } else {
          setErrorMessage(
            "An error occured while trying to register. Please try again."
          );
        }
        setAuthCtxIsLoading(false);
      });
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.page_contentContainerStyle}
    >
      <View style={[styles.content_container]}>
        <Text style={styles.title}>Register a new account</Text>
        <View style={styles.subtitle_container}>
          <Text>You already have an account? </Text>
          <Pressable onPress={() => router.push("/login")}>
            <Text style={styles.subtitle_part_two}>Login</Text>
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
                    placeholder="Password"
                    secureTextEntry={hidePassword}
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
          <View style={styles.input_container}>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.input_container}>
                  <Pressable
                    onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                    style={styles.hide_password_container}
                  >
                    {hideConfirmPassword ? (
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
                    placeholder="Confirm password"
                    secureTextEntry={hideConfirmPassword}
                  />
                  {errors["confirmPassword"] ? (
                    <Text style={styles.input_error}>
                      {errors["confirmPassword"].message}
                    </Text>
                  ) : null}
                </View>
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
            <Text style={styles.login_button_text}>Register</Text>
          )}
        </Pressable>

        {/* <View style={styles.or_content_container}>
          <View style={styles.line}></View>
          <Text style={styles.or_text}>or register with</Text>
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

// Icon from: https://icons8.com/icons/set/google
