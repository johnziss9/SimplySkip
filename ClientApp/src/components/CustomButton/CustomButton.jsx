import React from "react";
import { Button } from "@mui/material";

function CustomButton(props) {
    return (
        <Button 
            variant="contained"
            color="info"
            style={{ 
                backgroundColor: props.backgroundColor, 
                width: props.width, 
                height: props.height, 
                color: props.color, 
                margin: props.margin 
            }}
            onClick={props.onClick}
        >{props.buttonName}</Button>
    );
}

export default CustomButton;