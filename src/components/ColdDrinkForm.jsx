
import { useState } from "react";
import { coldDrinkOptions } from "../utils";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ColdDrinkForm(props) {
    const { isAuthenticated } = props;
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDrinkTypes, setShowDrinkTypes] = useState(false);
    const [drinkCost, setDrinkCost] = useState(0);
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);

    const { globalData, setGlobalData, globalUser } = useAuth();

    async function handleSubmitForm() {
        if (!isAuthenticated) {
            setShowModal(true);
            return;
        }

        if (!selectedDrink) {
            return;
        }

        try {
            const newGlobalData = {
                ...(globalData || {})
            };

            const nowTime = Date.now();
            const timeToSubtract = (hour * 60 * 60 * 1000) + (min * 60 * 1000);
            const timestamp = nowTime - timeToSubtract;

            const newData = {
                name: selectedDrink,
                cost: drinkCost
            };
            newGlobalData[timestamp] = newData;
            console.log(timestamp, selectedDrink, drinkCost);

            setGlobalData(newGlobalData);

            const userRef = doc(db, 'users', globalUser.uid);
            await setDoc(userRef, {
                [timestamp]: newData
            }, { merge: true });

            setSelectedDrink(null);
            setHour(0);
            setMin(0);
            setDrinkCost(0);
        } catch (err) {
            console.log(err.message);
        }
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    return (
        <>
            {showModal && (
                <Modal handleCloseModal={handleCloseModal}>
                    <Authentication handleCloseModal={handleCloseModal} />
                </Modal>
            )}

            <div className="section-header">
                <i className="fa-solid fa-pencil" />
                <h2>Start Tracking today....</h2>
            </div>
            <h4>
                Select Cold Drink Type
            </h4>
            <div className="drink-grid">
                {coldDrinkOptions.slice(0, 5).map((option, optionIndex) => {
                    return (
                        <button onClick={() => {
                            setSelectedDrink(option.name);
                            setShowDrinkTypes(false);
                        }} className={"button-card " + (option.name === selectedDrink ? ' drink-button-selected' : '')} key={optionIndex}>
                            <h4>{option.name}</h4>
                            <p>{option.caffeine}</p>
                        </button>
                    )
                })}
                <button onClick={() => {
                    setShowDrinkTypes(true);
                    setSelectedDrink(null);
                }} className={"button-card " + (showDrinkTypes ? ' drink-button-selected' : '')}>
                    <h4>Other</h4>
                    <p>n/a</p>
                </button>
            </div>
            {showDrinkTypes && (
                <select onChange={(e) => {
                    setSelectedDrink(e.target.value);
                }} id="drink-list" name="drink-list">
                    <option value={null}>Select type</option>
                    {coldDrinkOptions.map((option, optionIndex) => {
                        return (
                            <option value={option.name} key={optionIndex}>
                                {option.name} ({option.caffeine}mg)
                            </option>
                        )
                    })}
                </select>
            )}
            <h4>Add the cost of ($)</h4>
            <input className="w-full" type="number" value={drinkCost} onChange={(e) => {
                setDrinkCost(e.target.value);
            }} />
            <h4>Time Since Consumption</h4>
            <div className="time-entry">
                <div>
                    <h6>Hours</h6>
                    <select value={hour} onChange={(e) => {
                        setHour(e.target.value);
                    }} id="hours-select">
                        {[...Array(24).keys()].map((h) => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <h6>Mins</h6>
                    <select value={min} onChange={(e) => {
                        setMin(e.target.value);
                    }} id="minutes-select">
                        {[0, 5, 10, 15, 30, 45].map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>
            </div>
            <button onClick={handleSubmitForm}>
                <p>Add Entry</p>
            </button>
        </>
    )
}


