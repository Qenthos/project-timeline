const Admin = () => {
    return (
        <>
        <h1>Connexion : espace administrateur</h1>
        <form action="" method="get">
          <fieldset>
            <legend>Formulaire</legend>
            <ul>
              <li>
                <label htmlFor="mail">Adresse mail</label>
                <input type="text" name="mail" required />
              </li>
              <li>
                <label htmlFor="password">Mot de passe</label>
                <input type="password" name="password" required />
              </li>
              <ul>
                <li>
                  <input type="reset" value="Annuler" />
                </li>
                <li>
                  <input type="submit" value="Se connecter" />
                </li>
              </ul>
            </ul>
          </fieldset>
        </form>
        </>
    )
}