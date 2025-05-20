import { Link } from "react-router";

const Page404=()=> {
    return (
        <main >
            <section>
                <h1>Égaré sur les autoroutes de l’information</h1>
                <p>À l’heure où nous écrivons ces lignes, nous ne savons pas ce qu’il s’est précisément passé. Nous connaissons le résultat : vous êtes arrivé ici, dans cette rue sans issue de l’Internet. Vous vous êtes égaré sur les chemins pourtant tout tracés des autoroutes de l’information. Vous souhaitez désormais retrouver un environnement plus utile : la page d’accueil semble une bonne solution pour repartir de l’avant.</p>
                <Link to="/" >
                Prendre un nouveau départ
                </Link>
            </section>
        </main >
    )
}
export default Page404;