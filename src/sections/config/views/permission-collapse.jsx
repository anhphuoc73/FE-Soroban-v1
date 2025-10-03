import React, { useMemo } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import ListItemButton from '@mui/material/ListItemButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useTabs } from 'src/hooks/use-tabs';
import { useBoolean } from 'src/hooks/use-boolean';

import { usePermissionStore } from 'src/zustand/permission.zustand';

import { Iconify } from 'src/components/iconify';
import { CustomTabs } from 'src/components/custom-tabs';

const CollapseButton = styled(({ selected, children, disabled, ...other }) => (
  <ListItemButton disabled={disabled} {...other}>
    {children}
    <Iconify
      width={16}
      icon={
        ((!selected || disabled) && 'eva:arrow-ios-forward-fill') || 'eva:arrow-ios-downward-fill'
      }
    />
  </ListItemButton>
))(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4),
  fontWeight: 'bold',
  fontSize: 18,
  padding: '16px 31px',
  '&:hover': {
    background: '#fffff',
  },
}));

const PermissionFormControl = ({ rule, onChangeCheckbox, onChangeRadio }) => {
  const permissionState = usePermissionStore((state) => state.permissions);
  return (
    <FormControl key={rule.id} sx={{ mt: 2 }}>
      <FormGroup sx={{ flexDirection: 'row', gap: { xs: 'unset', lg: '20px' } }}>
        <FormControlLabel
          sx={{ whiteSpace: 'nowrap' }}
          control={<Checkbox />}
          label={rule.label}
          value={rule.value}
          onChange={(e) => onChangeCheckbox(e, rule.module, rule.children)}
          checked={
            rule.value === 'view'
              ? (permissionState[rule.module]?.view ?? false)
              : (permissionState[rule.module]?.actions || []).includes(rule.value)
          }
        />
      </FormGroup>
      {rule.children && (
        <RadioGroup name="radio-group" sx={{ ml: 5 }}>
          {rule.children.map((child) => (
            <FormGroup
              key={child.id}
              sx={{ flexDirection: 'row', gap: { xs: 'unset', lg: '20px' } }}
            >
              <FormControlLabel
                control={<Radio />}
                label={child.label}
                value={child.value}
                onChange={(e) => onChangeRadio(e, rule.module)}
                disabled={!permissionState[rule.module]?.view}
                checked={
                  permissionState[rule.module]?.view &&
                  (permissionState[rule.module]?.actions || []).includes(child.value)
                }
              />
            </FormGroup>
          ))}
        </RadioGroup>
      )}
    </FormControl>
  );
};

export const PermissionCollapse = ({ permission, index }) => {
  const collapse = useBoolean(true);
  const tabs = useTabs((permission.tabsList.length > 0 && permission.tabsList[0]?.value) || '');

  const setPermissionState = usePermissionStore((state) => state.setPermissions);

  const ruleList = useMemo(() => {
    if (permission.tabsList.length > 0) {
      return Array.isArray(permission.tabs[tabs.value])
        ? permission.tabs[tabs.value]
        : permission.tabs[tabs.value].rules;
    }
    return permission.rules;
  }, [permission, tabs.value]);

  const renderTabs = useMemo(
    () => (
      <CustomTabs
        value={tabs.value}
        onChange={tabs.onChange}
        variant="fullWidth"
        slotProps={{ tab: { px: 0, py: 0.5, borderRadius: '10px' } }}
      >
        {permission.tabsList.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </CustomTabs>
    ),
    [permission.tabsList, tabs]
  );

  const handleChangeCheckbox = (e, module, children) => {
    const { value, checked } = e.target;

    const currentState = usePermissionStore.getState().permissions[module] || {};
    let updatedModule = { ...currentState };

    if (value === 'view') {
      const actions = [...(updatedModule.actions || [])];
      const newAction = actions.filter((action) => !action.startsWith('view'));
      updatedModule = {
        ...updatedModule,
        view: checked,
        actions: newAction,
        children: Boolean(children),
      };
    } else {
      const actions = [...(updatedModule.actions || [])];
      const actionIndex = actions.indexOf(value);

      if (actionIndex !== -1) {
        actions.splice(actionIndex, 1);
      } else {
        actions.push(value);
      }

      updatedModule = {
        ...updatedModule,
        actions,
      };
    }

    setPermissionState({
      [module]: updatedModule,
    });
  };

  const handleChangeRadio = (e, module) => {
    const { value, checked } = e.target;
    const currentState = usePermissionStore.getState().permissions[module] || {};
    const updatedModule = { ...currentState };
    const actions = [...(updatedModule.actions || [])];
    if (checked) {
      updatedModule.actions = [...actions.filter((action) => !action.startsWith('view')), value];
    }
    setPermissionState({ [module]: updatedModule });
  };
  return (
    <Box sx={{ mt: 2 }}>
      <CollapseButton selected={collapse.value} onClick={collapse.onToggle}>
        {permission.title}
      </CollapseButton>
      <Divider sx={{ borderStyle: 'dashed' }} />

      <Collapse in={collapse.value}>
        <Stack spacing={2} sx={{ px: 4, py: 2 }}>
          <Box sx={{ maxWidth: { xs: '100%' }, '& .MuiTabs-root': { borderRadius: 1 } }}>
            {permission.isTabs && renderTabs}

            <Box
              sx={{
                columnGap: 6,
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: index === 5 ? 'column' : 'row',
              }}
            >
              {index === 5
                ? ruleList.map((rule, indexTab) => (
                    <Box key={indexTab}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: 16, pt: 2 }}>
                        {permission.tabs[tabs.value][indexTab]}
                      </Typography>
                      <Box sx={{ columnGap: 6, display: 'flex', flexWrap: 'wrap' }}>
                        {rule.map((i) => (
                          <PermissionFormControl
                            onChangeCheckbox={handleChangeCheckbox}
                            onChangeRadio={handleChangeRadio}
                            key={i.id}
                            rule={i}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))
                : ruleList.map((rule) => (
                    <PermissionFormControl
                      onChangeCheckbox={handleChangeCheckbox}
                      onChangeRadio={handleChangeRadio}
                      key={rule.id}
                      rule={rule}
                    />
                  ))}
            </Box>
          </Box>
        </Stack>
      </Collapse>
    </Box>
  );
};
