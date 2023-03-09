import NavbarBasic from "../components/Navbar";
import FooterBasic from "../components/Footer";
import FormDetails from "../components/FromDetails";

function Home() {
	return(
		<>
		<div className="d-flex flex-column vh-100">
			{<NavbarBasic/>}
			<main className="flex-grow-1">
				{<FormDetails/>}
			</main>
			{<FooterBasic/>}
		</div>


		</>
	)
}

export default Home;