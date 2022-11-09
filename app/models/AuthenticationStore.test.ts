import { AuthenticationStoreModel } from "./AuthenticationStore"

test( "test model",() => {

    let data = {
        authCode: "code01",
        authUsername: "test username",
        authPassword: "tes password",
    }

    const store = AuthenticationStoreModel.create(data);

    //Some simple tests
    expect(store.authUsername).not.toBeUndefined()
    expect(store.authUsername).not.toBeNull();

  })
