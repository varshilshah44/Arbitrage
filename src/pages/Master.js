import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Master(props) {
    const navigate = useNavigate();
    const isLogin = localStorage.getItem("accessToken") || false;

    const { ptitle, children } = props;

    useEffect(() => {
        document.title = ptitle;
    }, [ptitle]);

    useEffect(() => {
        if (!isLogin) {
            navigate('/login');
        }
    }, [isLogin]);


    return (
        <Fragment>
            <div className="frontEndLayout">
                {children}
                
            </div>
        </Fragment>
    );
}

export default Master;