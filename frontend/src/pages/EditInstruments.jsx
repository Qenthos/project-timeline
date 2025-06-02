import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useInstrumentsStore } from "./../stores/useStore";
import "./EditInstruments.scss";

const EditInstrument = () => {
  let { instruId } = useParams();
  let navigate = useNavigate();

  const instruStore = useInstrumentsStore();
  const instrument = instruStore.getInstrumentsById(Number(instruId));

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [created, setYear] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [description, setDescription] = useState("");

  /**
   * Initialize field about instrument
   */
  useEffect(() => {
    if (instrument) {
      setName(instrument.name);
      setCategory(instrument.category);
      setYear(instrument.created);
      setWeight(instrument.weight);
      setHeight(instrument.height);
      setDescription(instrument.description);
    }
  }, [instrument]);

  /**
   * Modif informations about instrument
   * @param {*} evt
   */
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (instruId) {
      const data = {
        name: name,
        category: category,
        created: parseInt(created),
        weight: parseFloat(weight),
        height: parseFloat(height),
        description: description,
      };
      try {
        const updatedInstrument = await instruStore.updateInstrument(
          instruId,
          data.name,
          data.category,
          data.created,
          data.weight,
          data.height,
          data.description
        );
        if (updatedInstrument) {
          navigate(-1);
        }
      } catch (error) {
        window.alert("Erreur lors de la modification");
      }
    }

    handleReset();
  };

  /**
   * Delete instrument
   */
  const handleDelete = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer cet instrument ?")) {
      try {
        await instruStore.deleteInstrument(instruId);
        navigate(-1);
      } catch (error) {
        window.alert("Erreur lors de la suppression");
      }
    }
  }

  /**
   * Back page
   */
  const handleReset = () => {
    navigate(-1);
  };

  return (
    <section className="instrument-edit">
      <h2 className="instrument-edit__title">
        Modifier l'instrument : {name.toLowerCase()}
      </h2>

      <form onSubmit={handleSubmit} className="instrument-edit__form">
        <ul className="instrument-edit__list">
          <li className="instrument-edit__item">
            <label htmlFor="name" className="instrument-edit__label">
              Nom de l'instrument
            </label>
            <input
              type="text"
              name="name"
              className="instrument-edit__input"
              minLength="3"
              maxLength="50"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </li>

          <li className="instrument-edit__item">
            <label htmlFor="category" className="instrument-edit__label">
              Catégorie
            </label>
            <input
              type="text"
              name="category"
              className="instrument-edit__input"
              minLength="3"
              maxLength="50"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </li>

          <li className="instrument-edit__item">
            <label htmlFor="created" className="instrument-edit__label">
              Année de création
            </label>
            <input
              type="number"
              name="created"
              className="instrument-edit__input"
              max={new Date().getFullYear()}
              value={created}
              onChange={(e) => setYear(e.target.value)}
            />
          </li>

          <li className="instrument-edit__item">
            <label htmlFor="weight" className="instrument-edit__label">
              Poids (en kg)
            </label>
            <input
              type="number"
              name="weight"
              className="instrument-edit__input"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </li>

          <li className="instrument-edit__item">
            <label htmlFor="height" className="instrument-edit__label">
              Taille (en cm)
            </label>
            <input
              type="number"
              name="height"
              className="instrument-edit__input"
              min="0"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </li>

          <li className="instrument-edit__item">
            <label htmlFor="description" className="instrument-edit__label">
              Description
            </label>
            <textarea
              name="description"
              rows="8"
              className="instrument-edit__textarea"
              minLength="100"
              maxLength="1000"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </li>
        </ul>

        <ul className="instrument-edit__actions">
          <li className="instrument-edit__action">
            <button
              type="button"
              onClick={handleReset}
              className="instrument-edit__button instrument-edit__button--cancel"
            >
              Annuler
            </button>
          </li>
          <li className="instrument-edit__action">
            <button
              type="submit"
              className="instrument-edit__button instrument-edit__button--submit"
            >
              Enregistrer les modifications
            </button>
          </li>
          <li className="instrument-edit__action">
            <button
              type="button"
              onClick={handleDelete}
              className="instrument-edit__button instrument-edit__button--delete"
            >
              Supprimer l'instrument
            </button>
          </li>
        </ul>
      </form>
    </section>
  );
};

export default EditInstrument;
