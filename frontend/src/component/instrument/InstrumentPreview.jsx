import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";
import "./InstrumentPreview.scss";

const InstrumentPreview = observer(({
  instrument,
  onViewDetail = () => {},
  editable = false,
  onEdit = () => {},
}) => {
  const headingId = `instrument-title-${instrument.id}`;
  const buttonId = `instrument-button-${instrument.id}`;

  return (
    <article className="instrument-card">
      <div className="instrument-card__image-wrapper">
        <img
        src={`/media/instru-cards/${instrument.image}`}
        alt={instrument.name}
          className="instrument-card__image"
        />
      </div>
      <div className="instrument-card__content">
        <ul className="instrument-card__list">
          <li className="instrument-card__item">
            <h3 id={headingId} className="instrument-card__title">
              {instrument.name}
            </h3>
          </li>
          <li>
            <span className="instrument-card__year">
              Année de création : {instrument.created}
            </span>
          </li>
        </ul>
        <button
          onClick={() => onViewDetail(instrument)}
          aria-labelledby={`${headingId} ${buttonId}`}
          id={buttonId}
          className="instrument-card__button instrument-card__button--primary"
        >
          Voir les détails
        </button>
        {editable && (
          <button
            onClick={() => onEdit(instrument.id)}
            aria-labelledby={instrument.name}
            className="instrument-card__button instrument-card__button--secondary"
          >
            Modifier
          </button>
        )}
      </div>
    </article>
  );
});

InstrumentPreview.propTypes = {
  instrument: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onViewDetail: PropTypes.func,
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default InstrumentPreview;
