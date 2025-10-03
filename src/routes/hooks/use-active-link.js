import { usePathname } from './use-pathname';
import { hasParams, removeParams, isExternalLink, removeLastSlash } from '../utils';

// ----------------------------------------------------------------------

export function useActiveLink(itemPath, deep = true) {
  const pathname = removeLastSlash(usePathname());

  const pathHasParams = hasParams(itemPath);

  /* Start check */
  const notValid = itemPath.startsWith('#') || isExternalLink(itemPath);

  if (notValid) {
    return false;
  }
  /* End check */

  /**
   * [1] Apply for Item has children or has params.
   */
  const isDeep = deep || pathHasParams;

  // console.info(isDeep ? '[deep]   :' : '[normal] :', itemPath, '-?-', pathname);

  if (isDeep) {
    /**
     * [1] Deep: default
     * @itemPath 			 = '/content-page/user'
     * @match pathname = '/content-page/user'
     * @match pathname = '/content-page/user/list'
     * @match pathname = '/content-page/user/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b15/edit'
     */
    const defaultActive = pathname.includes(itemPath);

    /**
     * [1] Deep: has params
     * @itemPath 			 = '/content-page/test?id=e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1'
     * @match pathname = '/content-page/test'
     */

    const originItemPath = removeParams(itemPath);

    const hasParamsActive = pathHasParams && originItemPath === pathname;

    return defaultActive || hasParamsActive;
  }

  /**
   * [1] Normal: active
   * @itemPath 			 = '/content-page/calendar'
   * @match pathname = '/content-page/calendar'
   */
  return pathname === itemPath;
}
