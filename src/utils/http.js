import axios from 'axios';

import { endpoints } from 'src/constants/endpoints';
import { HttpStatusCode } from 'src/constants/http-code-status';

import { toast } from 'src/components/snackbar';

import { setSession, STORAGE_KEY } from 'src/auth/context/jwt';

import { isAxiosConflictError, isAxiosUnauthorizedError } from './error-format';
import { removeLS, setProfileToLS, setRoleListToLS, getAccessTokenFromLS, setAccessTokenToLS } from './auth';

class Http {
  constructor() {
    this.instance = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.accessToken = getAccessTokenFromLS(STORAGE_KEY);
    this.handleReload = null;
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`;
          return config;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === endpoints.auth.login) {
          const { data } = response;
          this.accessToken = data.metadata.access_token;
          // const roleList = data?.metadata.role_list.reduce((acc, item) => {
          //   acc[item.module] = item;
          //   return acc;
          // }, {});
          setSession(this.accessToken);
          setProfileToLS(data.metadata.user);
          setAccessTokenToLS(this.accessToken);
          // setRoleListToLS(JSON.stringify(roleList));
        }

        return response;
      },
      (error) => {
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
            HttpStatusCode.Conflict,
            HttpStatusCode.InternalServerError,
            HttpStatusCode.BadGateway,
          ].includes(error.response?.status)
        ) {
          const data = error.response?.data;
          const message = data?.message || error.message;
          toast(message, { variant: 'error' });
        }

        if (isAxiosUnauthorizedError(error)) {
          toast(error.response?.data.metaData?.message || error.response?.data.message, {
            variant: 'error',
          });
          removeLS();
          this.accessToken = '';
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }

        if (isAxiosConflictError(error)) {
          toast(error.response?.data.metaData?.message || error.response?.data.message, {
            variant: 'error',
          });

          this.handleReload = this.handleReload
            ? this.handleReload
            : this.handleReloadPage().then((res) => {
                console.log(res);
              });
        }
        return Promise.reject(error);
      }
    );
  }

  async handleReloadPage() {
    return this.instance
      .get(URL.rbac.getRole)
      .then((res) => {
        const roleList = res.data?.metadata.reduce((acc, item) => {
          acc[item.module] = item;
          return acc;
        }, {});
        setRoleListToLS(JSON.stringify(roleList));
        return res;
      })
      .then((data) => {
        console.log('data', data);
        this.instance.post(URL.auth.keyTokens).then((_) => {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        });
      })
      .catch((e) => {
        removeLS();
        this.accessToken = '';
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });
  }
}
const http = new Http().instance;
export default http;
