import useToggleState from "@lib/hooks/use-toggle-state"
import { searchClient, SEARCH_INDEX_NAME } from "@lib/search-client"
import Modal from "@modules/common/components/modal"
import Search from "@modules/common/icons/search"
import DesktopHit from "@modules/search/components/desktop-hit"
import DesktopHits from "@modules/search/components/desktop-hits"
import SearchBox from "@modules/search/components/search-box"
import { InstantSearch } from "react-instantsearch-hooks-web"

const DesktopSearchModal = () => {
  const { state, close, open } = useToggleState()

  return (
    <>
      <div className="flex items-center w-auto h-full justify-center">
      <div className="items-center m-0 w-auto rounded-[50px] border border-[#FFFFFF59]">
      <input type="text" className=" w-48 h-8 bg-transparent text-white rounded-l-xl focus:outline-none px-2"/>
      <button onClick={open} className="w-7" >
        <Search />
      </button>
      </div>
      </div>
      <Modal isOpen={state} close={close} size="large">
        <Modal.Body>
          <InstantSearch
            indexName={SEARCH_INDEX_NAME}
            searchClient={searchClient}
          >
            <div className="flex flex-col h-full">
              <div className="w-full flex items-center gap-x-2 bg-gray-50 p-4">
                <Search />
                <SearchBox />
              </div>

              <div className="overflow-y-scroll flex-1 no-scrollbar mt-6">
                <DesktopHits hitComponent={DesktopHit} />
              </div>
            </div>
          </InstantSearch>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default DesktopSearchModal
