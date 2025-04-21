import React from 'react';
import '../output.css'
const Navbar = () => {
    return (
        <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-700 bg-primary/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
            <div className="px-4">
                <div className="flex items-center justify-between">
                    <div className="flex shrink-0">
                        <a aria-current="page" className="flex items-center" href="/">
                            <svg className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" style={{ enableBackground: 'new 0 0 2048 2048' }} xmlSpace="preserve">
                                <path style={{ fill: '#bbecff' }} d="M576.257 1334.528C399.388 1334.528 256 1191.14 256 1014.257c0-88.441 35.854-168.502 93.797-226.459C407.755 729.84 487.829 694 576.257 694h18.995c0-236.797 191.951-428.748 428.748-428.748S1452.748 457.204 1452.748 694h18.995C1648.612 694 1792 837.374 1792 1014.257c0 88.441-35.854 168.502-93.797 226.473-57.957 57.943-138.032 93.797-226.459 93.797H576.257z" />
                                <path style={{ fill: '#465a65' }} d="M682.672 1110.458h682.657v461.483H682.672z" />
                                <path style={{ fill: '#cfd8dd' }} d="M1485.836 1469.93H562.164c-22.091 0-40-17.909-40-40v-190.802c0-22.091 17.909-40 40-40h923.672c22.091 0 40 17.909 40 40v190.802c0 22.092-17.909 40-40 40zM1485.836 1157.113H562.164c-22.091 0-40-17.909-40-40V926.311c0-22.091 17.909-40 40-40h923.672c22.091 0 40 17.909 40 40v190.802c0 22.091-17.909 40-40 40z" />
                                <circle style={{ fill: '#465a65' }} cx="1312.478" cy="1021.712" r="47.818" />
                                <circle style={{ fill: '#465a65' }} cx="1174.716" cy="1021.712" r="47.818" />
                                <path style={{ fill: '#465a65' }} d="M977.547 1058.358H687.704c-20.239 0-36.646-16.407-36.646-36.646s16.407-36.646 36.646-36.646h289.843c20.239 0 36.646 16.407 36.646 36.646s-16.407 36.646-36.646 36.646z" />
                                <g>
                                    <circle style={{ fill: '#465a65' }} cx="1312.478" cy="1334.529" r="47.818" />
                                    <circle style={{ fill: '#465a65' }} cx="1174.716" cy="1334.529" r="47.818" />
                                    <g>
                                        <path style={{ fill: '#465a65' }} d="M977.547 1371.175H687.704c-20.239 0-36.646-16.407-36.646-36.646s16.407-36.646 36.646-36.646h289.843c20.239 0 36.646 16.407 36.646 36.646s-16.407 36.646-36.646 36.646z" />
                                    </g>
                                </g>
                                <g>
                                    <path style={{ fill: '#cfd8dd' }} d="M1485.836 1782.748H562.164c-22.091 0-40-17.909-40-40v-190.802c0-22.091 17.909-40 40-40h923.672c22.091 0 40 17.909 40 40v190.802c0 22.091-17.909 40-40 40z" />
                                    <circle style={{ fill: '#465a65' }} cx="1312.478" cy="1647.346" r="47.818" />
                                    <circle style={{ fill: '#465a65' }} cx="1174.716" cy="1647.346" r="47.818" />
                                    <g>
                                        <path style={{ fill: '#465a65' }} d="M977.547 1683.993H687.704c-20.239 0-36.646-16.407-36.646-36.646s16.407-36.646 36.646-36.646h289.843c20.239 0 36.646 16.407 36.646 36.646s-16.407 36.646-36.646 36.646z" />
                                    </g>
                                </g>
                            </svg>
                            <p className="sr-only">API Server Manager</p>
                        </a>
                    </div>
                    <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
                        <a
                            aria-current="page"
                            className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-textPrimary transition-all duration-200 hover:bg-primaryHover hover:text-textPrimary"
                            href="/home"
                        >
                            Home
                        </a>
                        <a
                            className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-textPrimary transition-all duration-200 hover:bg-primaryHover hover:text-textPrimary"
                            href="/console"
                        >
                            Console
                        </a>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <a
                            className="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                            href="/login"
                        >
                            Login
                        </a>
                        <a
                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            href="/register"
                        >
                            Register
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
