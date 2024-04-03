import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  SupportedAttributeTypes,
  SupportedAttributes,
} from "../../../../models/share/collection/CollectionBaseSchema";
import Grid from "@mui/material/Unstable_Grid2";
import {
  AudioExtensions,
  CodeLanguageTypes,
  ImageExtensions,
  MediaExtensions,
  MediaTypes,
  TextContentTypes,
  TextTypes,
  VideoExtensions,
} from "../../../../models/share/collection/BaseSchema";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import {
  CodeTypeSetting,
  AttributeSettingTypes,
  MediaTypeSetting,
  NumberTypeSetting,
  TextTypeSetting,
  SupportedAdvancedSettingTypes,
  SupportedAdvancedSettings,
} from "../../../../models/share/collection/AttributeTypeSettings";
import Validator from "../../../../utils/Validator";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function SettingsTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AttributeTypesForm({
  onSubmit,
  type,
  providedSettings,
}: {
  onSubmit: (settings: AttributeSettingTypes) => void;
  type: SupportedAttributeTypes;
  providedSettings?: AttributeSettingTypes;
}) {
  const [settings, setSettings] = React.useState<AttributeSettingTypes>();
  const [selectedSubType, setSelectedSubType] = React.useState<
    TextContentTypes | MediaTypes
  >();
  const [addAnotherFieldEnabled, setAddAnotherFieldEnabled] =
    React.useState(false);

  // required, unique, maxLength, minLength
  const [advancedSettingFlag, setAdvancedSettingsFlag] = React.useState(0);
  const [tabValue, setTabValue] = React.useState(0);
  const [typeNameInput, setTypeNameInput] = React.useState("");
  const [fileType, setFileType] = React.useState<
    ImageExtensions | AudioExtensions | VideoExtensions | MediaExtensions
  >();

  React.useEffect(() => {
    let settingObj: AttributeSettingTypes;
    switch (type) {
      case SupportedAttributes.text:
        if (settings === undefined) {
          settingObj = new TextTypeSetting();
          settingObj.textType = TextTypes.short_text;
          setSettings(settingObj);
          setSelectedSubType(settingObj.textType);
        }
        break;
      case "number":
        setSettings(new NumberTypeSetting());
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAnotherField = () => {
    if (settings) {
      if (settings instanceof TextTypeSetting) {
        // settings.maxLength = advancedSettingFlag & 4 ? 255 : 0;
        // settings.minLength = advancedSettingFlag & 8 ? 1 : 0;
        settings.isRequire = advancedSettingFlag & 1 ? true : false;
        settings.isUnique = advancedSettingFlag & 2 ? true : false;
        settings.textType = selectedSubType as TextContentTypes;
        settings.name = typeNameInput;
      }

      onSubmit(settings);
    }
  };
  const handleSubTypeChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    switch (value) {
      case TextTypes.short_text:
      case TextTypes.long_text:
      case TextTypes.reach_text:
        setSelectedSubType(value);
        break;
      case "media":
        setSettings((prev) => {
          if (prev instanceof MediaTypeSetting) {
            prev.mediaType = value as MediaTypes;
          }
          return prev;
        });
        break;
      case "code":
        setSettings((prev) => {
          if (prev instanceof CodeTypeSetting) {
            prev.language = value as CodeLanguageTypes;
          }
          return prev;
        });
        break;
    }
  };

  const handleTypeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAddAnotherFieldEnabled(Validator.isValidName(value));
    setTypeNameInput(value);
  };

  const onAdvancedSettingsChange = (
    advancedSettingTypes: SupportedAdvancedSettingTypes,
    value: boolean
  ) => {
    switch (advancedSettingTypes) {
      case SupportedAdvancedSettings.require:
        setAdvancedSettingsFlag((prev) => {
          return value ? prev | 1 : prev & ~1;
        });
        break;
      case SupportedAdvancedSettings.unique:
        setAdvancedSettingsFlag((prev) => {
          return value ? prev | 2 : prev & ~2;
        });
        break;
      case SupportedAdvancedSettings.max_length:
        setAdvancedSettingsFlag((prev) => {
          return value ? prev | 4 : prev & ~4;
        });
        break;
      case SupportedAdvancedSettings.min_length:
        setAdvancedSettingsFlag((prev) => {
          return value ? prev | 8 : prev & ~8;
        });
        break;
    }
  };

  const getSubTypeOptions = (type: SupportedAttributeTypes) => {
    return (
      <React.Fragment>
        <Typography variant="h6">Type</Typography>

        {type === "text" && (
          <RadioGroup
            row
            aria-labelledby="text-type-radio-buttons-group-label"
            onChange={handleSubTypeChange}
            value={selectedSubType}
            name="text-type-radio-buttons-group"
          >
            <FormControlLabel
              value={TextTypes.short_text}
              control={<Radio />}
              label={
                <React.Fragment>
                  <Typography variant="body1">Short Text</Typography>
                  <Typography variant="caption">
                    Best for titles, names, and links(URL).
                  </Typography>
                </React.Fragment>
              }
            />
            <FormControlLabel
              value={TextTypes.long_text}
              control={<Radio />}
              label={
                <React.Fragment>
                  <Typography variant="body1">Long Text</Typography>
                  <Typography variant="caption">
                    Best for descriptions, biography.
                  </Typography>
                </React.Fragment>
              }
            />
            <FormControlLabel
              value={TextTypes.reach_text}
              control={<Radio />}
              label={
                <React.Fragment>
                  <Typography variant="body1">Reach Text</Typography>
                  <Typography variant="caption">
                    Best for blog posts, articles, and notes.
                  </Typography>
                </React.Fragment>
              }
            />
          </RadioGroup>
        )}
      </React.Fragment>
    );
  };

  const BaseSettings = () => {
    switch (type) {
      case SupportedAttributes.text:
        return (
          <Box>
            <FormControl>
              <TextField
                id="type-name-input"
                label="Name"
                required={true}
                helperText="No spaces allowed"
                value={typeNameInput}
                variant="filled"
                onChange={handleTypeNameChange}
                autoFocus
              />
              {/* TODO: Fix a bug that it lose focus when input */}
              {getSubTypeOptions(type)}
            </FormControl>
          </Box>
        );
      case "number":
        return (
          <Box>
            <FormControl></FormControl>
          </Box>
        );
    }
  };

  const AdvancedSettings = ({
    required,
    unique,
    maxLength,
    minLength,
  }: {
    required?: boolean;
    unique?: boolean;
    maxLength?: boolean;
    minLength?: boolean;
  }) => {
    switch (type) {
      case SupportedAttributes.text:
        return (
          <Box>
            <FormGroup>
              <Grid container spacing={2}>
                {required !== undefined && (
                  <Grid xs={6}>
                    <FormControlLabel
                      value={SupportedAdvancedSettings.require}
                      control={
                        <Checkbox
                          checked={advancedSettingFlag & 1 ? true : false}
                          onChange={(e) => {
                            onAdvancedSettingsChange(
                              SupportedAdvancedSettings.require,
                              e.target.checked
                            );
                          }}
                        />
                      }
                      label="Required"
                    />
                  </Grid>
                )}
                {unique !== undefined && (
                  <Grid xs={6}>
                    <FormControlLabel
                      value={SupportedAdvancedSettings.unique}
                      control={
                        <Checkbox
                          checked={advancedSettingFlag & 2 ? true : false}
                          onChange={(e) => {
                            onAdvancedSettingsChange(
                              SupportedAdvancedSettings.unique,
                              e.target.checked
                            );
                          }}
                        />
                      }
                      label="Unique"
                    />
                  </Grid>
                )}
                {maxLength !== undefined && (
                  <Grid xs={6}>
                    <FormControlLabel
                      value={SupportedAdvancedSettings.max_length}
                      control={
                        <Checkbox
                          checked={advancedSettingFlag & 4 ? true : false}
                          onChange={(e) => {
                            onAdvancedSettingsChange(
                              SupportedAdvancedSettings.max_length,
                              e.target.checked
                            );
                          }}
                        />
                      }
                      label="Max length"
                    />
                  </Grid>
                )}
                {minLength !== undefined && (
                  <Grid xs={6}>
                    <FormControlLabel
                      value={SupportedAdvancedSettings.min_length}
                      control={
                        <Checkbox
                          checked={advancedSettingFlag & 8 ? true : false}
                          onChange={(e) => {
                            onAdvancedSettingsChange(
                              SupportedAdvancedSettings.min_length,
                              e.target.checked
                            );
                          }}
                        />
                      }
                      label="Min length"
                    />
                  </Grid>
                )}
              </Grid>
            </FormGroup>
          </Box>
        );
      case "number":
        return (
          <Box>
            <FormControl></FormControl>
          </Box>
        );
    }
  };

  function handleCancel() {}

  const SettingTabs = () => {
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
    };

    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="setting tabs"
          >
            <Tab label="BASE SETTINGS" {...a11yProps(0)} />
            <Tab label="ADVANCED SETTINGS" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <SettingsTabPanel value={tabValue} index={0}>
          <BaseSettings />
        </SettingsTabPanel>
        <SettingsTabPanel value={tabValue} index={1}>
          <AdvancedSettings
            required={false}
            unique={false}
            maxLength={false}
            minLength={false}
          />
        </SettingsTabPanel>
        <Button
          onClick={handleAddAnotherField}
          variant="contained"
          disabled={!addAnotherFieldEnabled}
        >
          Add another field
        </Button>
      </Box>
    );
  };

  return (
    <Box>
      <SettingTabs />
    </Box>
  );
}
