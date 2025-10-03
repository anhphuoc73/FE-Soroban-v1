import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAxiosUnprocessableEntityError } from 'src/utils/error-format';

import { AuthApi } from 'src/apis/auth-api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { AnimateLogo2 } from 'src/components/animate';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

import { isProduction } from '../../../utils/helper';
import { FormHead } from '../../components/form-head';

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  username: zod
    .string()
    .min(1, { message: 'Tên đăng nhập là bắt buộc' }),
  password: zod
    .string()
    .min(1, { message: 'Mật khẩu là bắt buộc' })
    .min(6, { message: 'Mật khẩu phải ít nhất 6 ký tự!!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const { checkUserSession } = useAuthContext();
  const password = useBoolean();
  const [errorLabel, setErrorLabel] = useState('');
  const defaultValues = {
    username: isProduction() ? '' : '0902312242',
    password: isProduction() ? '' : '0902312242',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = methods;

  const loginMutation = useMutation({
    mutationFn: AuthApi.login,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      loginMutation.mutate(data, {
        onSuccess: async (res) => {
          await checkUserSession?.();
          toast.success('Đăng nhập thành công', { duration: 2000 });
        },
        onError: (error) => {
          const message = error?.response?.data?.message  || 'Tài khoản đăng nhập không đúng'; 
          toast.error(message);
        }
      });
    } catch (error) {
      if (isAxiosUnprocessableEntityError(error)) {
        const formError = error.response?.data.errors;
        if (formError) {
          formError.forEach((key) => {
            const errKeyAndValue = Object.entries(key);
            setError(errKeyAndValue[0][0], {
              message: errKeyAndValue[0][1],
              type: 'Server',
            });
          });
        } else {
          reset({
            email: '',
            password: '',
          });
          setErrorLabel(error.response?.data.message);
        }
      }
    }
  });

  const renderLogo = <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />;

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="username"
        label="Tên đăng nhập"
        InputLabelProps={{ shrink: true }}
        placeholder="Nhập địa chỉ email"
      />

      <Box gap={1.5} display="flex" flexDirection="column">
        <Field.Text
          name="password"
          label="Mật khẩu"
          placeholder="6+ ký tự"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {!!errorLabel && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify
              icon="material-symbols:error"
              sx={{ color: (theme) => theme.vars.palette.error.main }}
            />
            <Typography sx={{ color: 'red', fontSize: '13px' }}>{errorLabel}</Typography>
          </Box>
        )}
        <Link
          component={RouterLink}
          // href={paths.authDemo.centered.resetPassword}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Quên mật khẩu?
        </Link>
      </Box>

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Đăng nhập..."
      >
        Đăng nhập
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {renderLogo}

      <FormHead title="Đăng nhập" />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
