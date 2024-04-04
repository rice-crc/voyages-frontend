import { ABOUTPAGE, BLOGPAGE } from '@/share/CONST_DATA';
import '@/style/homepage.scss';
import { Link } from 'react-router-dom';
export const FooterComponent = () => {
    return (
        <div className="footer-container">
            <div
                className="aos-container aos-init aos-animate"
                data-aos="fade-in"
                data-aos-easing="ease"
                data-aos-duration="500"
            >
                <div className="logo-grid-container">
                    <div className="logo-grid">
                        <Link
                            to="https://rice.edu/"
                            target="_blank"
                            rel="noopener"
                            aria-label="Rice University"
                        >
                            <div className="logo-grid-item fade-in">
                                <img
                                    className="card-img sponsor-card-img block lazy loaded"
                                    data-src="https://www.slavevoyages.org/static/images/site/logos/rice_white_205_76.svg"
                                    aria-label="Rice University"
                                    src="https://www.slavevoyages.org/static/images/site/logos/rice_white_205_76.svg"
                                    data-was-processed="true"
                                />
                            </div>
                        </Link>
                        <Link
                            to="https://emory.edu/"
                            target="_blank"
                            rel="noopener"
                            aria-label="Emory University"
                        >
                            <div className="logo-grid-item fade-in" style={{ width: 250 }}>
                                <img
                                    className="card-img sponsor-card-img block lazy loaded"
                                    data-src="https://www.slavevoyages.org/static/images/site/logos/emory_white_500_130.png"
                                    aria-label="Emory University"
                                    src="https://www.slavevoyages.org/static/images/site/logos/emory_white_500_130.png"
                                    data-was-processed="true"
                                />
                            </div>
                        </Link>

                        <Link
                            to="https://hutchinscenter.fas.harvard.edu/"
                            target="_blank"
                            rel="noopener"
                            aria-label="Hutchins Center for African and African American Research (Harvard University)"
                        >
                            <div className="logo-grid-item fade-in">
                                <img
                                    className="card-img sponsor-card-img block lazy loaded"
                                    data-src="https://www.slavevoyages.org/static/images/site/logos/hutchins_white_580_204.png"
                                    aria-label="Hutchins Center for African and African American Research (Harvard University)"
                                    src="https://www.slavevoyages.org/static/images/site/logos/hutchins_white_580_204.png"
                                    data-was-processed="true"
                                />
                            </div>
                        </Link>

                        <Link
                            to="https://nmaahc.si.edu/"
                            target="_blank"
                            rel="noopener"
                            aria-label="National Museum of African American History and Culture"
                        >
                            <div className="logo-grid-item fade-in">
                                <img
                                    className="card-img sponsor-card-img block lazy loaded"
                                    data-src="https://www.slavevoyages.org/static/images/site/logos/nmaahc_white_7510_3126.png"
                                    aria-label="National Museum of African American History and Culture"
                                    src="https://www.slavevoyages.org/static/images/site/logos/nmaahc_white_7510_3126.png"
                                    data-was-processed="true"
                                />
                            </div>
                        </Link>

                        <Link
                            to="https://oieahc.wm.edu/"
                            target="_blank"
                            rel="noopener"
                            aria-label="Omohundro Institute"
                        >
                            <div className="logo-grid-item fade-in" style={{ width: 150 }}>
                                <img
                                    className="card-img sponsor-card-img block lazy loaded"
                                    data-src="https://www.slavevoyages.org/static/images/site/logos/oi_white_686_528.svg"
                                    aria-label="Omohundro Institute"
                                    src="https://www.slavevoyages.org/static/images/site/logos/oi_white_686_528.svg"
                                    data-was-processed="true"
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="logo-grid-container">
                    <div className="logo-grid">
                        <div className="logo-grid-item fade-in" style={{ width: 100 }}>
                            <img
                                className="card-img sponsor-card-img block lazy loaded"
                                data-src="https://www.slavevoyages.org/static/images/site/logos/ucshield_white_250_250.svg"
                                aria-label="University of California"
                                src="https://www.slavevoyages.org/static/images/site/logos/ucshield_white_250_250.svg"
                                data-was-processed="true"
                            />
                        </div>

                        <Link
                            to="https://www.berkeley.edu/"
                            target="_blank"
                            rel="noopener"
                            aria-label="University of California, Berkeley"
                        >
                            <div className="logo-grid-item fade-in">
                                <img
                                    className="card-img sponsor-card-img block lazy loaded"
                                    data-src="https://www.slavevoyages.org/static/images/site/logos/ucberkeley_noshield_white_1200_369.png"
                                    aria-label="University of California, Berkeley"
                                    src="https://www.slavevoyages.org/static/images/site/logos/ucberkeley_noshield_white_1200_369.png"
                                    data-was-processed="true"
                                />
                            </div>
                        </Link>

                        <Link
                            to="https://uci.edu/"
                            target="_blank"
                            rel="noopener"
                            aria-label="University of California, Irvine"
                        >
                            <div className="logo-grid-item fade-in">
                                <img
                                    className="card-img sponsor-card-img block lazy loaded"
                                    data-src="https://www.slavevoyages.org/static/images/site/logos/uci_noshield_white_751_240.svg"
                                    aria-label="University of California, Irvine"
                                    src="https://www.slavevoyages.org/static/images/site/logos/uci_noshield_white_751_240.svg"
                                    data-was-processed="true"
                                />
                            </div>
                        </Link>

                        <Link
                            to="https://www.ucsc.edu/"
                            target="_blank"
                            rel="noopener"
                            aria-label="University of California, Santa Cruz"
                        >
                            <div className="logo-grid-item fade-in">
                                <img
                                    className="card-img sponsor-card-img block lazy loaded"
                                    data-src="https://www.slavevoyages.org/static/images/site/logos/ucsc_noshield_white_691_164.svg"
                                    aria-label="University of California, Santa Cruz"
                                    src="https://www.slavevoyages.org/static/images/site/logos/ucsc_noshield_white_691_164.svg"
                                    data-was-processed="true"
                                />
                            </div>
                        </Link>

                        <Link
                            to="https://www.cavehill.uwi.edu/home"
                            target="_blank"
                            rel="noopener"
                            aria-label="University of the West Indies at Cave Hill, Barbados (UWI)"
                        >
                            <div className="logo-grid-item fade-in">
                                <img
                                    className="card-img sponsor-card-img block lazy loaded"
                                    data-src="https://www.slavevoyages.org/static/images/site/logos/uwi_white_crest.png"
                                    aria-label="University of the West Indies at Cave Hill, Barbados (UWI)"
                                    src="https://www.slavevoyages.org/static/images/site/logos/uwi_white_crest.png"
                                    data-was-processed="true"
                                />
                            </div>
                        </Link>
                        <Link
                            to="https://cre2.wustl.edu/"
                            target="_blank"
                            rel="noopener"
                            aria-label="Washington University Center for the Study of Race, Ethnicity, and Equity"
                        >
                            <div className="logo-grid-item fade-in">
                                <img
                                    className="card-img sponsor-card-img block lazy loaded"
                                    data-src="https://www.slavevoyages.org/static/images/site/logos/washu_white_stacked_1280_836.png"
                                    aria-label="Washington University Center for the Study of Race, Ethnicity, and Equity"
                                    src="https://www.slavevoyages.org/static/images/site/logos/washu_white_stacked_1280_836.png"
                                    data-was-processed="true"
                                />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <footer className="footer-flex-container">
                <div className="footer-copyrights">
                    <div className="copyright">
                        <div className="highlight">
                            <Link
                                to={`${BLOGPAGE}/tag/about`}
                                target="_blank"
                                rel="noopener"
                                className="link grey"
                            >
                                <span className="bold">Slave Voyages</span> v2.2.13
                            </Link>
                        </div>
                        <div className="highlight">
                            Copyright 2021 The Slave Voyages Consortium. Software licensed
                            under{' '}
                            <Link
                                target="_blank"
                                rel="noopener"
                                to="https://www.gnu.org/licenses/gpl-3.0.en.html"
                                className="grey"
                            >
                                <span className="link">GNU General Public License 3.0</span>
                            </Link>{' '}
                            or later version.
                        </div>
                        <div className="highlight">
                            Some content licensed under{' '}
                            <Link
                                target="_blank"
                                rel="noopener"
                                to="https://creativecommons.org/licenses/by-nc/3.0/us/"
                                className="grey"
                            >
                                <span className="link">
                                    Creative Commons Attribution-Non-Commercial 3.0
                                </span>
                            </Link>
                            .
                        </div>
                    </div>
                </div>

                <div className="footer-logo">
                    <i>Powered by:</i>
                    <br />
                    <Link
                        target="_blank"
                        rel="noopener"
                        to="https://www.oracle.com/oracle-for-research/?source=:ex:pw:::::RiceSlaveVoyages&amp;SC=:ex:pw:::::RiceSlaveVoyages&amp;pcode="
                        className="link"
                    >
                        <img
                            aria-label="Powered by Oracle for Research"
                            src="https://www.slavevoyages.org/static/images/site/logos/oci_white_206_63.svg"
                            style={{ height: 35 }}
                        />
                    </Link>
                </div>
            </footer>
        </div>
    );
};
