import React from "react";
import logo from "../assets/caddcentre.svg";
import "./login.css";
import { BiArrowBack } from "react-icons/bi";
import { NavLink } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <div className="policy-container">
      <header className="policy-header">
        <NavLink to="/login" className="back-icon-link">
          <BiArrowBack size={24} />
        </NavLink>
        <img src={logo} alt="CADD Centre Logo" className="policy-logo" />
      </header>

      <main className="policy-content">
        <h2>Privacy Policy</h2>

        <section>
          <p>
            CADD Centre considers the security and protection of your personal
            data and information important. Therefore, CADD Centre operates its
            website in compliance with applicable laws on data privacy
            protection and data security.
          </p>
          <p>
            Below, we provide information on the types of data we collect
            through all CADD Centre websites, the purpose we use such data, and
            parties with which we share such data, where applicable.
          </p>
        </section>

        <hr className="policy-divider" />

        <section>
          <h2>Collected Data and Purpose of Processing</h2>
          <p>
            We only collect personal data (e.g. Names, Country, Location,
            Telephone/ Mobile, Email ID, etc.) with regard to operating our
            website only when you voluntarily provided this data to us (e.g.
            through registration, contact inquiries, surveys, etc.) and we are
            entitled to use or process such data by virtue of permission granted
            by you on the basis of statutory provision.
          </p>
          <p>
            As a general rule, we only use such data exclusively for the purpose
            for which the data was disclosed to us by you, such as to answer
            your inquiries, grant you access, process your orders, etc.
          </p>
        </section>

        <hr className="policy-divider" />

        <section>
          <h2>Data Sharing</h2>
          <p>
            For the purpose indicated above, insofar, as you have provided your
            consent, or when we are legally entitled to do so, we will share
            your personal data with the subsidiaries of CADD Centre, wherever
            required.
          </p>
          <p>
            In connection with the operation of this website and the services
            offered CADD Centre works as a network of all its subdivisions such
            as DreamZone, Synergy, CADD Centre, CCUBE, IID, Skillease, One
            Channel, CADD at School and Dream Flower.
          </p>
          <p>
            These Strategic Business units are located in and outside India,
            possibly, all over the Asia, in this regard; the applicability of
            data secrecy and protection laws may vary. In such cases, CADD
            Centre takes measures to ensure an appropriate level of data privacy
            and protection.
          </p>
          <p>
            Data is shared only in compliance with the applicable laws and
            regulations. We do not sell or otherwise market your personal data
            to third parties.
          </p>
        </section>

        <hr className="policy-divider" />

        <section>
          <h2>Questions, Comments and Amendments</h2>
          <p>
            CADD Centre will respond to all the legitimate requests for
            information, and wherever applicable to correct, amend or delete
            your personal data. If you wish to make such a request or if you
            have questions or comments about this Data Privacy Policy, please
            click on "Contact Us" and feel free to share.
          </p>
          <p>
            This Data Privacy policy is updated on a regular basis. You will
            find the date of the last update on this page.
          </p>
        </section>
      </main>
    </div>
  );
}

export default PrivacyPolicy;
