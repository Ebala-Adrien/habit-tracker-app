import constants from "@/constants";
import { ScrollView, View, Text, Pressable, TextInput } from "react-native";
import styles from "@/styles/login_and_register_style";
import { useAuthContext } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import * as Yup from "yup";
import { Link } from "expo-router";
import LoadingComponent from "@/components/utility/Loading";

const schema = Yup.object().shape({
  email: Yup.string().email().required(),
});

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { authCtxIsLoading, setAuthCtxIsLoading } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [successMsg, setSuccessMsg] = useState<null | string>(null);

  const onSubmit: SubmitHandler<any> = async (data) => {
    setAuthCtxIsLoading(true);
    const { email } = data;

    sendPasswordResetEmail(auth, email)
      .then((_) => {
        setSuccessMsg(
          "An email has been sent to you with instructions on how to reset your password."
        );
      })
      .catch((error) => {
        console.error(error.message);
        setErrorMessage(
          "An error occurred while trying to login. Please try again."
        );
      })
      .finally(() => setAuthCtxIsLoading(false));
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.page_contentContainerStyle}
    >
      <View style={[styles.content_container]}>
        <Text style={styles.title}>Password forgotten</Text>
        <View style={styles.subtitle_container}>
          <Text>Please enter your email address</Text>
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
                    setSuccessMsg(null);
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
                <View style={styles.forgot_password_container}>
                  <Link style={styles.forgot_password_link} href="/login">
                    Back to login
                  </Link>
                </View>
              </>
            )}
          />
        </View>

        {successMsg ? (
          <View>
            <Text>{successMsg}</Text>
          </View>
        ) : errorMessage ? (
          <View>
            <Text style={styles.input_error}>{errorMessage}</Text>
          </View>
        ) : null}

        <Pressable style={styles.login_button} onPress={handleSubmit(onSubmit)}>
          {authCtxIsLoading ? (
            <LoadingComponent size={30} color={constants.colorSecondary} />
          ) : (
            <Text style={styles.login_button_text}>Reset Password</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
