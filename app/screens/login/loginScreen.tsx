import React, { FC, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, TextStyle, ViewStyle, Image, ImageStyle, View } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../../components"
import { colors, spacing } from "../../theme"
import { useStores } from "../../models"
import { isRTL } from "../../i18n"

const bancoIndustrial = require("../../../assets/images/banco-industrial.png")

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
      <View style={$imageContainer}>
        <Image style={$bancoIndustrial} source={bancoIndustrial} resizeMode="contain" />
      </View>

      <Text
        testID="login-heading"
        tx="loginScreen.welcomeMessage"
        preset="heading"
        style={$welcomeMessage}
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
        style={$enterButton}
        textStyle={$enterTextButton}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
  backgroundColor: colors.palette.secondary600,
}

const $welcomeMessage: TextStyle = {
  marginBottom: spacing.small,
  color: colors.palette.secondary700,
  fontSize: 26,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.medium,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
  borderWidth: 0,
}

const $enterButton: ViewStyle = {
  marginTop: spacing.extraSmall,
  backgroundColor: colors.palette.secondary800,
  borderRadius: 20,
}

const $bancoIndustrial: ImageStyle = {
  height: 100,
}

const $imageContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignContent: "center",
}

const $enterTextButton: TextStyle = { fontSize: 22 }
