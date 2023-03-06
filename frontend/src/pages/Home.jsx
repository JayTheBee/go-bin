import NavbarBasic from "../components/Navbar";
import FooterBasic from "../components/Footer";
import BasicExample from "./FromDetails";

function Home() {
	return(
		<>
		<div className="d-flex flex-column vh-100">
			{<NavbarBasic/>}
			<main className="flex-grow-1">
				{<BasicExample/>}
			</main>
			{<FooterBasic/>}
		</div>


		</>
	)
}

export default Home;