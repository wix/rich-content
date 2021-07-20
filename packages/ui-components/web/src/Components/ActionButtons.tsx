import React from 'react';
import classNames from 'classnames';
import Button from './Button';
import { RichContentTheme } from 'wix-rich-content-common';
import styles from '../../statics/styles/action-buttons.scss';
import { BUTTON_SIZE } from '../consts';

type ButtonSizeKeys = keyof typeof BUTTON_SIZE;
export interface ActionButtonsProps {
  size?: typeof BUTTON_SIZE[ButtonSizeKeys];
  onCancel: () => void;
  onSave: () => void;
  cancelText: string;
  saveText: string;
  isMobile?: boolean;
  saveBtnDataHook?: string;
  cancelBtnDataHook?: string;
  disableSave?: boolean;
  theme?: RichContentTheme;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  size,
  onCancel,
  onSave,
  cancelText,
  saveText,
  isMobile = false,
  theme,
  disableSave = false,
}) => (
  <div className={classNames(styles.action_buttons, { [styles.mobile]: isMobile })}>
    <Button
      size={size}
      theme={theme}
      ariaProps={{ 'aria-label': cancelText }}
      dataHook="actionButtonCancel"
      onClick={onCancel}
      className={classNames(styles.action_buttons_button, {
        [styles.mobile]: isMobile,
      })}
      type={'secondary'}
      text={cancelText}
    />
    <Button
      size={size}
      ariaProps={{ 'aria-label': saveText } && disableSave && { disabled: 'disabled' }}
      theme={theme}
      className={classNames(
        styles.action_buttons_button,
        styles.action_buttons_button_primary,
        { [styles.mobile]: isMobile },
        { [styles.disabled]: disableSave }
      )}
      dataHook="actionButtonSave"
      onClick={onSave}
      type={'primary'}
      text={saveText}
    />
  </div>
);

export default ActionButtons;
