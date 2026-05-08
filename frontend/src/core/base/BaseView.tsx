import React from 'react';

import { BaseStatus } from './BaseStatus';
import { LogUtils } from '@/core/utils';

type Props = {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
};

const BaseView: React.FC<Props> = ({
    children,
    style,
    className
}) => {
    return (
        <React.Fragment>
            <section
                className={`base-page--1 ${className ?? ''}`}
                style={style}
            >
                {children}
            </section>
        </React.Fragment>
    );
};

export default BaseView;


/*
import React from 'react';
import "./styles.css"
import BaseView from "@/core/base/BaseView";
import { VM } from "./VM";

const Page: React.FC = () => {

    const { config, action } = VM();

    return (
        <BaseView status={config.status}>
            <div>
                <main>
                    <Outlet />
                </main>
            </div>
        </BaseView>
    )
}
export default Page;
*/
