import { getNumberBit } from '../utils';
import { PanelBasePath } from './../common/constants';
import { PanelInfo, TagLinkInfo } from './../types/canvas';

const panelInfoList: PanelInfo[] = [
  {
    id: 'Plume',
    name: 'Plume',
  },
  {
    id: 'Ikun',
    name: 'Ikun',
  },
];

export const infoListLinks: TagLinkInfo[] = panelInfoList.map((item: PanelInfo, index: number) => {
  return {
    no: `${index + 1}`.padStart(getNumberBit(panelInfoList.length), '0'),
    path: PanelBasePath + item.id,
    name: item.name,
  };
});
