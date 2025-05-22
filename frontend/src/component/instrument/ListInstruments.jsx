import PropTypes from "prop-types";
import InstrumentDetail from "./InstrumentDetail";
import InstrumentPreview from "./InstrumentPreview";
import { useState } from "react";
import "./ListInstruments.scss";

const ListInstruments = ({
  instruments,
  editable = false,
  onEdit = () => {},
}) => {
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [filterInstrument, setFilterInstrument] = useState(instruments)

  const handleViewDetail = (instrument) => {
    setSelectedInstrument(instrument);
  };

  const handleCloseDetail = () => {
    setSelectedInstrument(null);
  };

  const handleCategory = (evt) => {
    const selectedCategory = evt.currentTarget.dataset.category;
  
    if (selectedCategory === "all") {
      setFilterInstrument(instruments);
    } else {
      const filtered = instruments.filter(
        (instru) => instru.category === selectedCategory
      );
      setFilterInstrument(filtered);
    }
  };
  

  return (
    <>
      <h3 className="list__filter-title">Mode de trie</h3>
      <ul className="list__filter-instrument">
        <li className="filter-instrument__item">  
          <button onClick={handleCategory} className="filter-instrument__button filter-instrument__button--active" data-category="all">
            Tout
          </button>
        </li>
        <li className="filter-instrument__item">
          <button onClick={handleCategory} className="filter-instrument__button" data-category="percussion">Percussions</button>
        </li>
        <li className="filter-instrument__item">
          <button onClick={handleCategory} className="filter-instrument__button" data-category="vent">Vents</button>
        </li>
        <li className="filter-instrument__item">
          <button onClick={handleCategory} className="filter-instrument__button" data-category="corde">Cordes</button>
        </li>
      </ul>
      <ul className="list__instruments">
        {filterInstrument.map((instrument) => (
          <li key={instrument.id}>
            <InstrumentPreview
              instrument={instrument}
              onViewDetail={handleViewDetail}
              editable={editable}
              onEdit={onEdit}
            />
          </li>
        ))}
      </ul>
      {selectedInstrument && (
        <InstrumentDetail
          instrument={selectedInstrument}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};

ListInstruments.propTypes = {
  instruments: PropTypes.array.isRequired,
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default ListInstruments;
