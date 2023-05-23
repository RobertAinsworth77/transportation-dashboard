import AuthLayoutComponentProps from "./AuthLayoutComponentProps";
import './AuthLayoutStyles.scss';

const AuthLayoutComponent: React.FC<AuthLayoutComponentProps> = ({ children }) => {
    return (
        <div className="auth_layout_component">
            <img src="./assets/images/auth_person.png" alt="" className="boy_img img-fluid" />
            <div className="card shadow">
                <div className="card-body">
                    <div className="d-flex">
                        <img src="./assets/logos/logo.png" alt="" className="img-fluid img_logo" />
                        <div className="flow-grow-1 d-flex flex-column justify-content-center">
                            <strong>Transportation</strong>
                            <span>Dahsboard</span>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayoutComponent;