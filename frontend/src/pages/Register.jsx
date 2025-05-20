import Header from "../component/Header";

const Register = () => {
  return (
    <>
      <Header />
      <h1>Créer un profil</h1>
      <form action="" method="post">
        <fieldset>
          <legend>Formulaire de création</legend>
          <ul>
            <li>
              <label htmlFor="mail">Adresse mail</label>
              <input type="text" name="mail" required />
            </li>
            <li>
              <label htmlFor="pseudo">Pseudo</label>
              <input type="text" name="pseudo" required />
            </li>
            <li>
              <label htmlFor="password">Mot de passe</label>
              <input type="password" name="password" required />
            </li>
            <li>
              <label htmlFor="confirm_password">Confirmer le mot de passe</label>
              <input type="password" name="confirm_password" required />
            </li>
            <ul>
              <li>
                <input type="reset" value="Annuler" />
              </li>
              <li>
                <input type="submit" value="Créer un compte" />
              </li>
            </ul>
          </ul>
        </fieldset>
      </form>
    </>
  );
};

export default Register;
