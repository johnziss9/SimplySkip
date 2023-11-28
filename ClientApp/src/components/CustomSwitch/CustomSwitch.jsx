import { FormControlLabel, Switch } from "@mui/material";
import React from "react";

function CustomSwitch(props) {
    return (
        <FormControlLabel
            control={
                <Switch
                    disabled={props.disabled}
                    checked={props.checked}
                    onChange={props.onChange}
                />
            }
            label={props.label}
        />
    );
}

export default CustomSwitch;