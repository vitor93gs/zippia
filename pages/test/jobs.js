import { useState, useEffect } from "react"; // import useState and useEffect hooks from React
import axios from "axios"; // import axios for making HTTP requests
import { Spinner, Button, Card, Modal } from "react-bootstrap"; // import Bootstrap components
import { Carousel } from "react-responsive-carousel"; // import Carousel component
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import Carousel styles

export default function JobSlider() {
  // define JobSlider component
  const [jobs, setJobs] = useState([]); // declare state for job data
  const [renderJobs, setRenderJobs] = useState([]); // declare state for rendered jobs
  const [loading, setLoading] = useState(true); // declare state for loading status
  const [current, setCurrent] = useState(0); // declare state for current carousel index
  const [show, setShow] = useState(false); // declare state for showing/hiding job modal
  const [description, setDescription] = useState({}); // declare state for job description

  useEffect(() => {
    // useEffect hook to fetch job data on component mount
    const fetchJobs = async () => {
      const res = await axios.post("https://www.zippia.com/api/jobs/", {
        // make a POST request to the Zippia API
        companySkills: true,
        dismissedListingHashes: [],
        fetchJobDesc: true,
        jobTitle: "Business Analyst",
        locations: [],
        numJobs: 20,
        previousListingHashes: [],
      });
      const data = res.data.jobs.slice(0, 10); // extract first 10 jobs from API response
      setJobs(data); // update job data state
      setRenderJobs(data); // update rendered jobs state
      setLoading(false); // set loading status to false
    };
    fetchJobs(); // call fetchJobs function
  }, []);

  const sortJobsByCompany = () => {
    // function to sort jobs by company name
    const sortedJobs = [...jobs].sort((a, b) =>
      a.companyName.localeCompare(b.companyName)
    );
    setRenderJobs(sortedJobs); // update rendered jobs state
  };

  const filterJobsByDate = () => {
    // function to filter jobs published within the last week
    const filteredJobs = jobs.filter((job) => {
      const publishDate = new Date(job.OBJpostingDate).getTime(); // convert job publish date to Unix timestamp
      const currentDate = new Date().getTime(); // get current date as Unix timestamp
      const oneWeekAgo = currentDate - 7 * 24 * 60 * 60 * 1000; // calculate Unix timestamp for one week ago
      return publishDate >= oneWeekAgo; // return true if job publish date is within the last week
    });
    setRenderJobs(filteredJobs); // update rendered jobs state
  };

  const handleClose = () => {
    // function to hide job modal and reset description state
    setShow(false);
    setTimeout(() => {
      // set timeout so the
      setDescription({});
    }, 300);
  };
  const handleShow = (job) => {
    // function to show job modal and set description state
    setDescription(job);
    setShow(true);
  };

  return (
    <div className="back">
      {/* Add Bootstrap stylesheet */}
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />

      {/* Render title */}
      <h1 className="title">Job Listings</h1>

      {loading ? ( // render spinner while job data is being fetched
        // Display spinner while waiting for data to load
        <div className="spinner-container">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            style={{ width: "3rem", height: "3rem" }}
          ></Spinner>
        </div>
      ) : (
        // Render job listings
        <div>
          {/* Add filter and sort buttons */}
          <div className="d-flex justify-content-center my-3">
            <div>
              <Button
                variant="primary"
                className="mx-5"
                onClick={() => filterJobsByDate()} // filter jobs by date
              >
                Filter by Date
              </Button>
              <Button
                variant="primary"
                className="mx-5"
                onClick={() => sortJobsByCompany()} // sort jobs by company
              >
                Sort by Company
              </Button>
            </div>
          </div>

          {/* Render job listing carousel */}
          <div className="carousel-container">
            <Carousel
              emulateTouch={true}
              selectedItem={current}
              className="carousel"
              onChange={(index) => setCurrent(index)}
              showThumbs={false}
              showIndicators={true}
              autoPlay={true}
              infiniteLoop={true}
              interval={3000}
              renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && (
                  <Button
                    type="button"
                    onClick={onClickHandler}
                    title={label}
                    className="control-prev"
                  >
                    <span>&#60;</span>
                  </Button>
                )
              }
              renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && (
                  <Button
                    type="button"
                    onClick={onClickHandler}
                    title={label}
                    className="control-next"
                  >
                    <span>&#62;</span>
                  </Button>
                )
              }
            >
              {/* Render each job card */}
              {renderJobs.map((job) => (
                <div key={job.jobId}>
                  <Card className="card">
                    <Card.Body className="card-body">
                      <div>
                        <Card.Title>{job.jobTitle}</Card.Title>
                        <Card.Subtitle>{job.companyName}</Card.Subtitle>
                        <Button
                          variant="primary"
                          className="mt-3"
                          onClick={() => {
                            handleShow(job); // display job details in modal
                          }}
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>

          {/* Render job details modal */}
          <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header>
              <Modal.Title>{description.jobTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body
              dangerouslySetInnerHTML={{
                __html: description.jobDescription,
              }}
            />
            {/* Render a close button for the modal */}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
}
