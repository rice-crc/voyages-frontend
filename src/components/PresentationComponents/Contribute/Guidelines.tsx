import '@/style/contributeContent.scss';

const Guidelines: React.FC = () => {
  return (
    <div className="contribute-content">
      <h1 className="page-title-1">Guidelines for Contributors</h1>
      <p>
        {' '}
        The guide is provided as a PDF file to allow users to reference it in a
        separate window or to download and print it.{' '}
      </p>
      <ul className="guide-pdf">
        <li>
          <a href="/documents/download/GuideContributors.pdf" target="blank">
            GuideContributors.pdf
          </a>
        </li>
      </ul>
    </div>
  );
};
export default Guidelines;
