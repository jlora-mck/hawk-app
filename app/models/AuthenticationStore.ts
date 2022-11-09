import { Instance, SnapshotOut, types, cast } from "mobx-state-tree"
import { api } from "../services/api"

export const AuthenticationStoreModel = types //CODE REVIEW: leer qué significan las propiedades 'views', 'actions', etc en MobX
  .model("AuthenticationStore")
  .props({
    authCode: types.optional(types.string, ""),
    authUsername: types.optional(types.string, ""),
    authPassword: types.optional(types.string, ""),
    isLoginError: types.optional(types.boolean, false),
  })
  .views((store) => ({
    get validationErrors() {
      return {
        authCode: (function () {
          if (store.authCode.length === 0) return "can't be blank"
          if (store.authCode.length < 6) return "must be at least 6 characters"
          return ""
        })(),
        authPassword: (function () {
          if (store.authPassword.length === 0) return "can't be blank"
          if (store.authPassword.length < 6) return "must be at least 6 characters"
          return ""
        })(),
        authUsername: (function () {
          if (store.authPassword.length === 0) return "can't be blank"
          if (store.authPassword.length < 6) return "must be at least 6 characters"
          return ""
        })(),
        isLoginError: (function () {
          if (store.isLoginError) return "Wrong credentials"
          return ""
        })(),
      }
    },
  }))
  .actions((store) => ({
    setAuthCode(value: string) {
      store.authCode = value.replace(/ /g, "")
    },
    setAuthUsername(value: string) {
      store.authUsername = value.replace(/ /g, "")
    },
    setAuthPassword(value: string) {
      store.authPassword = value.replace(/ /g, "")
    },
    setIsLoginError(value: boolean) {
      store.isLoginError = value
    },
    logout() {
      store.authCode = ""
      store.authUsername = ""
      store.authPassword = ""
      store.isLoginError = false
    },
    async login(code, username: string, password: string) {
      const { kind, rawData } = await api.login(code, username, password)
      if (kind === "ok") {
        const { id, fullname } = rawData
        this.setAuthUsername("")
      } else {
        this.setIsLoginError(true)
        console.tron.error(`Error loging in`, [])
      }
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
