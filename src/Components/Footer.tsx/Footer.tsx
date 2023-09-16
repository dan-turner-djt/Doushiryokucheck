import { AppBar, Toolbar } from "@mui/material";
import "./Footer.scss";


const Footer = () => {

	return ( 
		<AppBar position="static" color="appbarBlue" sx={{ top: "auto", bottom: 0 }}>
			<Toolbar variant="dense" sx={{ justifyContent: { xs: "center", sm: "right" }, fontWeight: "500" }}>
				<p >By Dan Turner</p>
			</Toolbar>
		</AppBar>
	);
};
 
export default Footer;