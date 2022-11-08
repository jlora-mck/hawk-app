import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../../navigators"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../../components"
import { colors, spacing } from "../../theme"
import { useStores } from "../../models"
import { NONE } from "apisauce"
import { Colors } from "react-native/Libraries/NewAppScreen"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: {
      authCode,
      authPassword,
      authUsername,
      setAuthCode,
      setAuthPassword,
      setAuthUsername,
      login: performLogin,
      validationErrors,
    },
  } = useStores()

  const errors: typeof validationErrors = isSubmitted ? validationErrors : ({} as any)

  async function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)
    await performLogin(authCode, authUsername, authPassword)
    if (Object.values(validationErrors).some((v) => !!v)) return

    setIsSubmitted(false)
    setAuthPassword("")
    setAuthCode("")
    setAuthCode("")
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text
        testID="login-heading"
        tx="loginScreen.welcomeMessage"
        preset="heading"
        style={$signIn}
      />

      <TextField
        value={authCode}
        onChangeText={setAuthCode}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTx="loginScreen.code"
        helper={errors?.authCode}
        status={errors?.authCode ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        value={authUsername}
        onChangeText={setAuthUsername}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTx="loginScreen.user"
        helper={errors?.authCode}
        status={errors?.authCode ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        placeholderTx="loginScreen.password"
        helper={errors?.authPassword}
        status={errors?.authPassword ? "error" : undefined}
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />
      {errors?.isLoginError && (
        <Text text="Wrong Credentials" size="sm" weight="light" style={$hint} />
      )}

      <Button
        testID="login-button"
        tx="loginScreen.enter"
        style={$tapButton}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
  backgroundColor: "#0B1856",
}

const $signIn: TextStyle = {
  marginBottom: spacing.small,
  color: "#14961F",
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.medium,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
  borderWidth: 0,
  backgroundColor: NONE,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
  backgroundColor: "#0C957B",
}
