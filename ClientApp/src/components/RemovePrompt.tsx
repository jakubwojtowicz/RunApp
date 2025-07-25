import React from 'react';
import styles from './styles/RemovePrompt.module.css';

interface RemovePromptProps {
    title: string;
    onCancel: () => void;
    onConfirm: () => void;
}
const RemovePrompt: React.FC<RemovePromptProps> = ({ title, onConfirm, onCancel }) => {
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>{title}</h2>
                <div className={styles.buttonsContainer}>
                    <button className={styles.button} onClick={() => { onConfirm() }}>
                        Yes
                    </button>

                    <button className={styles.button} onClick={() => { onCancel() }}>
                        Cancel
                    </button>

                </div>
            </div>
        </div>
    );
}


export default RemovePrompt;
