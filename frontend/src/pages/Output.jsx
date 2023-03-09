import NavbarBasic from "../components/Navbar";
import FooterBasic from "../components/Footer";
import OutputDetails from "../components/OutputDetails";

function Home() {
	return(
		<>
		<div className="d-flex flex-column vh-100">
			{<NavbarBasic/>}
			<main className="flex-grow-1">
				{<OutputDetails/>}
			</main>
			{<FooterBasic/>}
		</div>


		</>
	)
}

export default Home;