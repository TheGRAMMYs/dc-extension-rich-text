import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@material-ui/core";
import React from "react";

import { Hyperlink } from "@dc-extension-rich-text/common";

const BLANK_MARKDOWN = ":blank:"

interface HyperlinkDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: Hyperlink) => void;
  value: any;
}

function validateUrl(value: string): boolean {
  return value != null && value.length > 0;
}

const HyperlinkDialog: React.SFC<HyperlinkDialogProps> = (
  props: HyperlinkDialogProps
) => {
  const { open, onClose, onSubmit } = props;

  const [value, setValue] = React.useState<Hyperlink>({
    href: "",
    title: "",
    target: ""
  });

  const [lastValue, setLastValue] = React.useState<Hyperlink>();

  if (props.value != null && lastValue !== props.value) {
    setValue(props.value);
    setLastValue(props.value);
  }

  const [isValid, setIsValid] = React.useState(false);

  const handleInputChanged = React.useCallback(
    (name: string, fieldValue: string) => {
      const newValue = {
        ...value,
        [name]: fieldValue,
      };

      setValue(newValue);
      setIsValid(validateUrl(newValue.href));
    },
    [value, setValue, setIsValid]
  );

  const reset = () => {
    setValue({
      href: "",
      title: "",
      target: ""
    });
    setLastValue(undefined);
  };

  const handleCancel = React.useCallback(() => {
    reset();
    if (lastValue === undefined) {
      onClose();
    } else {
      onSubmit({ ...lastValue, cancel: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastValue, setLastValue, onSubmit]);

  const handleClear = React.useCallback(() => {
    reset();
    onClose();
  }, [onClose]);

  const changeMarkdown = (value: Hyperlink): Hyperlink => {
    if (!value.target && value.href.startsWith(BLANK_MARKDOWN)) {
      return {
        ...value,
        href: value.href.replace(BLANK_MARKDOWN, "")
      }
    }
    if (value.target && !value.href.startsWith(BLANK_MARKDOWN)) {
      return {
        ...value,
        href: `${BLANK_MARKDOWN}${value.href}`
      }
    }
    return value
  }

  const handleSubmit = React.useCallback(() => {
    reset();
    const _value = changeMarkdown(value)
    onSubmit(_value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, setValue, onSubmit]);

  const hasTarget = value?.target == '_blank'

  return (
    <Dialog
      maxWidth="md"
      fullWidth={true}
      open={open}
      onClose={handleCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Hyperlink</DialogTitle>
      <DialogContent>
        <FormControl fullWidth={true}>
          <TextField
            autoFocus={true}
            id="href"
            label="Web Address"
            type="input"
            required={true}
            fullWidth={true}
            value={value.href?.replace(BLANK_MARKDOWN, "")}
            onChange={(event) => handleInputChanged("href", event.target.value)}
          />
          <FormHelperText>
            Example: https://www.storefront.com/black-friday
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth={true}>
          <TextField
            id="title"
            label="Title"
            type="input"
            fullWidth={true}
            value={value.title}
            onChange={(event) =>
              handleInputChanged("title", event.target.value)
            }
          />
          <FormHelperText>Example: Black Friday Sale</FormHelperText>
        </FormControl>
        
        <div className="link-target-container">
          <FormLabel>Opens in new tab?</FormLabel>
          <div className="check">
            <Checkbox value={'_blank'} checked={hasTarget} onChange={(event) => handleInputChanged("target", value?.target ? '' : event.target.value)}/>
            <FormHelperText>Mark this box as checked if you'd like this CTA to open a new tab in the user's browser. Good for off site links.</FormHelperText>
          </div>
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear} color="primary">
          Clear
        </Button>
        <Button disabled={!isValid} onClick={handleSubmit} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HyperlinkDialog;
