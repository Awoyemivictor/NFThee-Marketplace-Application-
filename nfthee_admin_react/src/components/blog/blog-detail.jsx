import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Breadcrumb from '../common/breadcrumb.component';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { Container, Button } from 'reactstrap';
import moment from 'moment';
import Swal from 'sweetalert2';
import Loader from './loader';
import { toast } from 'react-toastify';
import axios from 'axios';
import instance from '../../axios';

const BlogDetail = () => {
  let history = useHistory();

  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(true);

  // const instance = axios.create({
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem('token')}`,
  //   },
  // });

  // Date / Blog Title / Author Name /  Date of Posting   - (View / Delete )

  const columns = [
    // {
    //   name: " ID",
    //   selector: "_id",
    //   sortable: true,
    //   emptyValue: () => <em>null</em>,
    // },
    {
      name: 'Title',
      selector: 'title',
      sortable: true,
      emptyValue: () => <em>null</em>,
    },
    {
      name: 'Author',
      selector: 'author_name',
      sortable: true,
    },
    // {
    //   name: "Sub Description",
    //   selector: "sub_description",
    //   sortable: true,
    // },
    // {
    //   name: "Dscription",
    //   selector: "description",
    //   sortable: true,
    // },
    {
      name: 'Posting',
      selector: 'date_of_posting',
      sortable: true,
    },
    // {
    //   name: "Status",
    //   selector: "status",
    //   sortable: true,
    // },
    // {
    //   name: "Meta Tag",
    //   selector: "meta_tag",
    //   sortable: true,
    // },
    // {
    //   name: "meta Title",
    //   selector: "meta_title",
    //   sortable: true,
    // },
    // {
    //   name: "Meta Description",
    //   selector: "meta_description",
    //   sortable: true,
    // },
    // {
    //   name: "keyword tag",
    //   selector: "keyword_tag",
    //   sortable: true,
    // },
    {
      name: 'Date',
      selector: 'createdAt',
      sortable: true,
    },
    // {
    //   name: "updated At",
    //   selector: "updatedAt",
    //   sortable: true,
    // },
    {
      name: 'Action',
      selector: '_id',
      sortable: true,
      cell: (data) => (
        <div>
          {console.log(data)}
          <button
            className='btn btn-primary btn-sm'
            onClick={() => onViewBlog(data)}
            id='1'
          >
            <i className='fa fa-eye'></i>
          </button>{' '}
          <button
            className='btn btn-secondary btn-sm'
            // onClick={() => onDel(data)}
            onClick={() => onUpdate(data)}
            // key={id}
          >
            <i className='fa fa-pencil'></i>
          </button>{' '}
          <button
            className='btn btn-danger btn-sm'
            onClick={() => onDel(data)}
            id='3'
          >
            <i className='fa fa-trash'></i>
          </button>
        </div>
      ),
    },
  ];

  const onDel = (data) => {
    console.log('del');
    Swal.fire({
      title: 'Are you sure you want to do this?',
      cancelButtonText: 'No!',
      confirmButtonText: 'Yes!',
      reverseButtons: true,
      showCancelButton: true,
    }).then(function(result) {
      if (result.value) {
        deleteBlog(data);
      }
    });
  };

  const tableData = {
    data,
    columns,
  };

  const onUpdate = (e) => {
    console.log('onUpdate=>', e);
    // history.push(`${process.env.REACT_APP_ADMIN_RENDER_BASE_URL}/blog/blogEdit?blogId=${e._id}`);
    history.push(
      `/blog/blogEdit?blogId=${e._id}`
    );

    console.log();
  };

  useEffect(() => {
    // if (loading) {
    instance
      .get(`api/blog/all`)
      .then((res) => {
        if (res.data) {
          const newData = res.data.data.map((item) => {
            return {
              ...item,
              date_of_posting: moment(item['date_of_posting']).format(
                'DD/MM/YYYY'
              ),
              createdAt: moment(item['createdAt']).format('DD/MM/YYYY'),
            };
          });
          setdata(newData);

          setLoading(false);
        }
      });
    // }
  }, []);

  const deleteBlog = (e) => {
    const blogId = e._id;
    console.log(e._id);
    const next = [...data];
    // remove and save the item of interest to your variable
    const removedItems = next.splice(next.indexOf(e), 1);
    // your axios function formatted for /delete/:id
    const deleteCarModel = instance.delete(
      `api/blog/delete`,
      blogId
    );
    // update react state with the new array
    setdata(next);
  };

  const onViewBlog = (e) => {
    console.log('onViewBlog=>', e);
    history.push(`/blog/blogSingle?blogId=${e._id}`);
  };
  const handleAddNewBlog = (e) => {
    history.push(
      `/blog/blogPost`
    );
  };
  // const onUpdateBlog = (e) => {
  //   console.log("onUpdateBlog=>", e);
  //   history.push(`${process.env.PUBLIC_URL}/blog/blogPost?blogId=${e._id}`);
  // };

  return (
    <Fragment>
      <Breadcrumb title='Blogs' parent='Blog' />
      {loading ? (
        <Loader />
      ) : (
        <Container fluid={true}>
          <div className='text-right'>
            <Button
              color='primary'
              type='submit'
              onClick={handleAddNewBlog}
              className='btn-lg'
            >
              <i className='icon-plus'></i> Add New Blog
            </Button>
          </div>
          {/* <Button
						color="primary"
						className="btn-block btn-mail text-center mb-0 mt-0"
					>
						<i className="fa fa-paper-plane mr-2"></i>SEND
					</Button> */}

          <DataTableExtensions {...tableData}>
            <DataTable
              columns={columns}
              data={data}
              noHeader
              defaultSortField='id'
              defaultSortAsc={false}
              highlightOnHover
              pagination
              striped
            />
          </DataTableExtensions>
        </Container>
      )}
    </Fragment>
  );
};

export default BlogDetail;
