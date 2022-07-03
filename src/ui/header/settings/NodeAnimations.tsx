import styled from "styled-components";
import {Slider, TextField} from "@mui/material";
import React, {ChangeEvent, FC, useState} from "react";
import {limitNumberField} from "../../../utils/utils";
import {AnimationSpeed} from "../../../utils/settings";

const Container = styled.div`
  margin: 1em 0;
`;

export const NodeAnimations: FC<{ animationSpeed: AnimationSpeed }> = ({animationSpeed}) => {
    const setVisitDelay = (newValue: number) => animationSpeed.visitDelay = newValue;
    const setPathDelay = (newValue: number) => (animationSpeed.pathDelay = newValue);

    return (
        <Container>
            <InputSlider label="Node visit delay (ms)" max={100} defaultValue={animationSpeed.visitDelay}
                         setGlobalValue={setVisitDelay}/>
            <InputSlider label="Path delay (ms)" max={250} defaultValue={animationSpeed.pathDelay}
                         setGlobalValue={setPathDelay}/>
        </Container>
    );
};

const SliderTitleContainer = styled.div`
  margin: 4px;
`;

const SliderTitle = styled.h3`
  font-weight: normal;
  font-size: 1.25em;
`;

const SliderContainer = styled.div`
  display: flex;

  & > :nth-child(n + 2) {
    margin-left: 25px;
  }
`;

const InputSlider = ({
                         label,
                         min = 0,
                         max = 1000,
                         defaultValue,
                         setGlobalValue
                     }: { label: string, min?: number, max?: number, defaultValue: number, setGlobalValue: (value: number) => void }) => {
    const [value, setValue] = useState(defaultValue ?? min);
    setGlobalValue(value);

    const handleSliderChange = (newValue: number | number[]) => {
        if (Array.isArray(newValue)) return;

        setValue(newValue);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(event.target.value));
    };

    return (
        <SliderTitleContainer>
            <SliderTitle>{label}</SliderTitle>
            <SliderContainer>
                <Slider size="small" min={min} max={max} value={value}
                        onChange={(event, value) => handleSliderChange(value)}/>
                <TextField
                    type="number"
                    variant="standard"
                    sx={{width: 70}}
                    value={value}
                    onChange={handleInputChange}
                    onInput={(event) => limitNumberField(event, min, max)}
                    inputProps={{min, max, step: 10}}
                ></TextField>
            </SliderContainer>
        </SliderTitleContainer>
    );
};
