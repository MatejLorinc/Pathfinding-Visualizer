import styled from "styled-components";
import SettingsIcon from "@mui/icons-material/Settings";
import {Dropdown} from "../Header";
import React, {FC} from "react";
import {NodeAnimations} from "./NodeAnimations";
import {Neighbors} from "./Neighbors";
import {Settings} from "../../../utils/settings";

const SettingsMenuContainer = styled.div`
  padding: 0 16px;
`;

export const SettingsDropdown: FC<{
    settings: Settings,
    disabled?: boolean
}> = ({settings, disabled}) => {
    return (
        <Dropdown name="Settings" icon={<SettingsIcon/>} disabled={disabled}>
            <SettingsMenuContainer>
                <NodeAnimations animationSpeed={settings.animationSpeed}/>
                <Neighbors neighborOrder={settings.neighborOrder}/>
            </SettingsMenuContainer>
        </Dropdown>
    );
};
