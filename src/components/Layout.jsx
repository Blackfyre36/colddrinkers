import { useState } from "react";
import Authentication from "./Authentication";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import Footer from "./Footer";

export default function Layout(props) {
    const {children} = props;

    const [showModal, setShowModal] = useState(false)

    const {globalUser, logout} = useAuth()

    const header = (<header>
      <div>
        <h1 className="text-gradient">COLDCAFF</h1>
        <p>For Cold Drink insatiates</p>
      </div>
      {globalUser ? (<button onClick={logout}>
        <p>Logout</p>
      </button>) : (<button onClick={() => {
      setShowModal(true)}}>
        <p>Sign up free</p>
        <i className="fa-solid fa-mug-hot"></i>
      </button>)}
    </header>)
    function handleCloseModal() {
      setShowModal(false)
    }


     
    return (
        <>
        {showModal && (<Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>)}
      {header}
      <main>
        {children}
        </main>
        <Footer />
        </>
      
    )
}