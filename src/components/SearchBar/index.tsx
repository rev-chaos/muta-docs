import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'

const SearchBarDiv = styled.div`
  width: 250px;
  height: 60px;
  margin: 0 30px;
  input {
    width: 100%;
    height: 40px;
    font-size: 14px;
    text-align: center;
    color: black;
    border-radius: 2px 2px;
    background-color: hsla(0, 0%, 100%, 0.125);
    &:focus {
      background-color: white;
    }
  }
  .searchResultPanel {
    position: absolute;
    top: 0;
    right: 0;
    background-color: white;
    // border-radius: 2px 2px;
    h5 {
      border-bottom: 1px solid black;
      padding: 0 20px;
    }
    overflow: auto;
    width: 530px;
    max-height: 100%;
    .searchResultItem {
      .searchResultItemFile {
        height: 40px;
        line-height: 30px;
        padding: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border: 1px solid rgb(209, 213, 218);
        color: white;
        background-color: rgb(36, 41, 46);
        cursor: pointer;
        text-align: left;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`
export default ({
  config,
  routeProps,
}: {
  config: any
  routeProps: RouteComponentProps
}) => {
  const [open, setOpen] = useState(false)
  const inputSearchCondition = useRef<HTMLInputElement>(null)
  const [searchResults, setSearchResults] = useState()

  const search = () => {
    const searchCondition = (inputSearchCondition &&
      inputSearchCondition.current) as HTMLInputElement
    if (searchCondition.value) {
      const results: any = {
        //
      }
      const regexp = new RegExp(searchCondition.value, 'g')
      const divElement = document.createElement('div')
      Object.keys(config.dicts).forEach((file: string): void => {
        const resulting = config.dicts[file].replace(
          regexp,
          "<span class='myHighLight'>$&</span>"
        )
        if (resulting !== config.dicts[file]) {
          divElement.innerHTML = resulting
          const elements = divElement.querySelectorAll('span.myHighLight')
          for (let i = 0; i < elements.length; i++) {
            if (!results[file]) {
              results[file] = []
            }
            const element = elements[i] as HTMLElement
            results[file].push(
              `${element.previousElementSibling &&
                element.previousElementSibling.innerHTML} ${
                element.innerHTML
              } ${element.nextElementSibling &&
                element.nextElementSibling.innerHTML}`
            )
          }
        }
      })

      setSearchResults(results)
      setOpen(true)
    } else {
      setOpen(false)
    }
  }
  const isEmpty = !searchResults || Object.keys(searchResults).length === 0
  let searchResultsUI
  if (isEmpty) {
    searchResultsUI = (
      <div className="searchResultItem">
        <div
          className="searchResultItemFile"
          style={{
            textAlign: 'center',
            textDecoration: 'none',
            cursor: 'unset',
          }}
        >
          Not found
        </div>
      </div>
    )
  } else {
    searchResultsUI =
      searchResults &&
      Object.keys(searchResults).map((file: string, index: number) => {
        const path = file.replace(/\\/g, '/')
        return (
          <div className="searchResultItem">
            <div
              className="searchResultItemFile"
              role="link"
              tabIndex={index}
              onClick={() => {
                routeProps.history.push(path)
                window.scrollTo(0, 0)
                setOpen(false)
              }}
              onKeyPress={() => {}}
            >
              {path}
            </div>
          </div>
        )
      })
  }
  return (
    <SearchBarDiv>
      <input
        ref={inputSearchCondition}
        type="text"
        placeholder="Search"
        onChange={search}
      />
      <div
        className={open ? 'mask' : 'mask mask--close'}
        role="button"
        tabIndex={-1}
        onClick={() => setOpen(false)}
        onKeyPress={() => {}}
      >
        <div
          className="searchResultPanel markdown-body"
          role="button"
          tabIndex={-1}
          onClick={e => !isEmpty && e.stopPropagation()}
          onKeyPress={() => {}}
          style={{
            maxHeight: window.innerHeight - 60,
          }}
        >
          {searchResultsUI}
        </div>
      </div>
    </SearchBarDiv>
  )
}
