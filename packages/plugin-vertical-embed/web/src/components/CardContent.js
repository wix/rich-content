import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../statics/styles/widget.scss';

const subtitle = info => {
  return (
    info.leftSubtitle && (
      <div className={styles.subtitle}>
        {info.leftSubtitle}
        {info.rightSubtitle && (
          <span>
            <span className={styles.right}>|</span>
            {info.rightSubtitle}
          </span>
        )}
      </div>
    )
  );
};

const ellipsisTitle = title => {
  return title.length <= 80 ? title : `${title.substring(0, 80)}...`;
};

const CardContent = props => {
  const { title, info, buttonText } = props;
  return (
    <div className={styles.content}>
      <div>
        <div className={styles.title}>{ellipsisTitle(title)}</div>
        {info && subtitle(info)}
      </div>
      <div className={styles.button}>
        <div className={styles.buttonText}>{buttonText}</div>
      </div>
    </div>
  );
};

CardContent.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.object,
  buttonText: PropTypes.string.isRequired,
};

export default CardContent;
